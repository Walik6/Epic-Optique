import React, { useEffect, useState } from 'react';
import { FaImage } from 'react-icons/fa';
import './Caisse.css';
import useAdminAuth from '../hooks/useAdminAuth';

const CaissePage = () => {
  useAdminAuth();

  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [panier, setPanier] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [message, setMessage] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastVente, setLastVente] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL;
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetch(`${API_URL}/getCategories.php`)
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('show_out_of_stock', 'true');
    params.append('limit', ITEMS_PER_PAGE);
    params.append('page', page);
    if (searchTerm) params.append('search', searchTerm);
    if (filterCategory) params.append('categorie', filterCategory);

    fetch(`${API_URL}/getProduits.php?${params}`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data?.produits) ? data.produits : data;
        setProduits(list || []);
        setTotalPages(data.totalPages || 1);
        // Scroll en haut de la grille produits
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(console.error);
  }, [searchTerm, filterCategory, page]);

  const ajouterAuPanier = (p) => {
    if (p.quantite <= 0) return;
    const exist = panier.find(i => i.id === p.id);
    if (exist) {
      if (exist.quantite_vendue >= p.quantite) return;
      setPanier(panier.map(i =>
        i.id === p.id ? { ...i, quantite_vendue: i.quantite_vendue + 1 } : i
      ));
    } else {
      setPanier([...panier, { ...p, quantite_vendue: 1 }]);
    }
  };

  const modifierQuantite = (id, q) => {
    if (q <= 0) {
      setPanier(panier.filter(i => i.id !== id));
      return;
    }
    const prod = produits.find(p => p.id === id);
    if (q > prod.quantite) return;
    setPanier(panier.map(i =>
      i.id === id ? { ...i, quantite_vendue: q } : i
    ));
  };

  const total = panier.reduce((t, i) => t + i.prix * i.quantite_vendue, 0);

  const validerVente = async () => {
    if (panier.length === 0) return;
    const res = await fetch(`${API_URL}/validerVente.php`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        total,
        items: panier.map(i => ({
          produit_id: i.id,
          quantite: i.quantite_vendue,
          prix_unitaire: i.prix
        }))
      })
    });
    const data = await res.json();
    if (data.success) {
      setLastVente({ items: panier, total, date: new Date() });
      setShowReceipt(true);
      setPanier([]);
      setMessage('✅ Vente enregistrée');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  return (
    <div className="caisse-page">
      <h1>🛒 Caisse</h1>
      {message && <div className="notification">{message}</div>}

      <div className="caisse-layout">
        {/* PRODUITS */}
        <div className="produits-zone">
          <div className="filters">
            <input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            />
            <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}>
              <option value="">Toutes catégories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>

          <div className="produits-grid">
            {produits.map(p => (
              <div
                key={p.id}
                className={`produit-card ${p.quantite === 0 ? 'disabled' : ''}`}
                onClick={() => ajouterAuPanier(p)}
              >
                {p.image ? <img src={p.image} alt={p.nom}/> : <div className="no-image"><FaImage size={20} /></div>}
                <h3>{p.nom}</h3>
                <p>{p.prix.toLocaleString()} DZD</p>
                <span className="stock">
                  {p.quantite === 0 ? 'Rupture' : `Stock: ${p.quantite}`}
                </span>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="pagination-caisse">
            <button onClick={handlePrev} disabled={page === 1}>← Précédent</button>
            <span>Page {page} / {totalPages}</span>
            <button onClick={handleNext} disabled={page === totalPages}>Suivant →</button>
          </div>
        </div>

        {/* PANIER */}
        <div className="panier-zone">
          <h2>Panier</h2>
          {panier.map(i => (
            <div key={i.id} className="panier-item">
              <span>{i.nom}</span>
              <div className="qte">
                <button onClick={() => modifierQuantite(i.id, i.quantite_vendue - 1)}>−</button>
                <input
                  type="number"
                  value={i.quantite_vendue}
                  onChange={e => modifierQuantite(i.id, +e.target.value)}
                />
                <button onClick={() => modifierQuantite(i.id, i.quantite_vendue + 1)}>+</button>
              </div>
              <span>{(i.prix * i.quantite_vendue).toLocaleString()} DZD</span>
            </div>
          ))}
          <div className="total">Total : {total.toLocaleString()} DZD</div>
          <button className="valider" onClick={validerVente}>
            Valider la vente
          </button>
        </div>
      </div>

      {/* REÇU */}
      {showReceipt && lastVente && (
        <div className="modal" onClick={() => setShowReceipt(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2>Vente confirmée</h2>
            {lastVente.items.map((i, idx) => (
              <div key={idx}>{i.nom} x{i.quantite_vendue}</div>
            ))}
            <strong>Total : {lastVente.total.toLocaleString()} DZD</strong>
            <button onClick={() => setShowReceipt(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaissePage;
