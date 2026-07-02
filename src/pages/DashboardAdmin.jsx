import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEye, FaTrash, FaCommentDots } from 'react-icons/fa';
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
      <h1>Commandes</h1>
      {message && <div className="notification">{message}</div>}

      <div className="commandes-list">
        {commandes.map(cmd => (
          <div key={cmd.id} className="commande-card">
            <div className="commande-card-top">
              <div className="commande-card-client">
                <strong>{cmd.nom_client} {cmd.prenom_client}</strong>
                <span><FaPhoneAlt size={11} /> {cmd.telephone}</span>
                <span><FaMapMarkerAlt size={11} /> {cmd.adresse}</span>
              </div>
              <span className={`statut ${cmd.statut}`}>{cmd.statut.replace('_', ' ')}</span>
            </div>

            {cmd.commentaire && (
              <p className="commande-card-comment"><FaCommentDots size={12} /> {cmd.commentaire}</p>
            )}

            <div className="commande-card-bottom">
              <select
                className="admin-select"
                value={cmd.statut}
                onChange={e => updateStatut(cmd.id, e.target.value)}
              >
                <option value="en_attente">En attente</option>
                <option value="retour">Retour</option>
                <option value="confirmée">Confirmée</option>
                <option value="livrée">Livrée</option>
              </select>

              <div className="commande-card-actions">
                <button className="admin-btn secondary" onClick={() => fetchCommandeDetail(cmd.id)}>
                  <FaEye size={12} /> Détail
                </button>
                <button className="admin-btn danger" onClick={() => deleteCommande(cmd.id)} aria-label="Supprimer">
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
