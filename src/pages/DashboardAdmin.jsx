import React, { useEffect, useState } from 'react';
import './DashboardAdmin.css';
import useAdminAuth from '../hooks/useAdminAuth';

const DashboardAdmin = () => {
  useAdminAuth(); // protège la page

  const [commandes, setCommandes] = useState([]);
  const [detailCommande, setDetailCommande] = useState(null);
  const [message, setMessage] = useState('');

  // 🔹 Pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCommandes = () => {
    fetch(`${API_URL}/getCommandes.php?page=${page}&limit=${limit}`, { credentials: 'include' })
      .then(res => res.json())
      .then(setCommandes)
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchCommandes(); }, [page]);

  const fetchCommandeDetail = async (id) => {
    try {
      const res = await fetch(`${API_URL}/getCommandeDetails.php?id=${id}`, { credentials: 'include' });
      const data = await res.json();
      setDetailCommande({ id, items: data });
    } catch {
      setMessage("Erreur lors de la récupération des détails");
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const closeModal = () => setDetailCommande(null);

  const updateStatut = async (id, statut) => {
    await fetch(`${API_URL}/updateStatut.php`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, statut })
    });
    fetchCommandes();
    setMessage(`Statut de la commande #${id} mis à jour en "${statut.replace('_',' ')}"`);
    setTimeout(() => setMessage(''), 3000);
  };

  const deleteCommande = async id => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette commande ?')) return;
    try {
      const res = await fetch(`${API_URL}/deleteCommande.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) fetchCommandes();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="dashboard-admin">
      <h1>Dashboard Admin</h1>
      {message && <div className="notification">{message}</div>}

      <table className="commandes-table">
        <thead>
          <tr>
            <th>Nom</th><th>Prénom</th><th>Adresse</th><th>Téléphone</th>
            <th>Statut</th><th>Changer statut</th><th>Commentaire</th><th>Détail</th><th>Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map(cmd => (
            <tr key={cmd.id}>
              <td>{cmd.nom_client}</td>
              <td>{cmd.prenom_client}</td>
              <td>{cmd.adresse}</td>
              <td>{cmd.telephone}</td>
              <td><span className={`statut ${cmd.statut}`}>{cmd.statut.replace('_',' ')}</span></td>
              <td>
                <select value={cmd.statut} onChange={e => updateStatut(cmd.id, e.target.value)}>
                  <option value="en_attente">En attente</option>
                  <option value="retour">Retour</option>
                  <option value="confirmée">Confirmée</option>
                  <option value="livrée">Livrée</option>
                </select>
              </td>
              <td>{cmd.commentaire || '-'}</td>
              <td>
                <button className="detail-btn" onClick={() => fetchCommandeDetail(cmd.id)}>
                  Voir détail
                </button>
              </td>
              <td>
                <button className="delete-btn" onClick={() => deleteCommande(cmd.id)}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 PAGINATION */}
      <div className="pagination">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ← Précédent
        </button>

        <span>Page {page}</span>

        <button
          onClick={() => setPage(p => p + 1)}
          disabled={commandes.length < limit}
        >
          Suivant →
        </button>
      </div>

      {detailCommande && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Détails commande #{detailCommande.id}</h2>
            <p>
              <strong>Commentaire :</strong>{" "}
              {commandes.find(c => c.id === detailCommande.id)?.commentaire || '-'}
            </p>

            <table>
              <thead>
                <tr><th>Produit</th><th>Quantité</th><th>Prix</th></tr>
              </thead>
              <tbody>
                {detailCommande.items.map(item => (
                  <tr key={item.produit_id}>
                    <td>{item.nom}</td>
                    <td>{item.quantite}</td>
                    <td>{item.prix.toLocaleString('fr-FR')} DZD</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="close-btn" onClick={closeModal}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
