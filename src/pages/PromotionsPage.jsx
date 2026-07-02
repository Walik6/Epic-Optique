import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PromotionsPage.css';
import { useCart } from '../context/CartContext';
import useSEO from '../hooks/useSEO';
import PriceTag, { ProductRibbon } from '../components/PriceTag';

const PromotionsPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useSEO({
    title: 'Promotions | Epic Optique',
    description: 'Profitez des promotions en cours chez Epic Optique sur nos montures et lunettes.',
    url: 'https://epicoptique.com/promotions'
  });

  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categorieId, setCategorieId] = useState('');
  const [filter, setFilter] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/getCategories.php`)
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, [API_URL]);

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ promo: 'true', show_out_of_stock: 'true' });
        if (search) params.append('search', search);
        if (categorieId) params.append('categorie', categorieId);
        if (filter) params.append('filter', filter);

        const res = await fetch(`${API_URL}/getProduits.php?${params.toString()}`);
        const data = await res.json();
        setProduits(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur:', err);
        setProduits([]);
      }
      setLoading(false);
    };

    fetchPromotions();
  }, [API_URL, search, categorieId, filter]);

  return (
    <div className="produits-page">
      <h1 className="produits-title">🎉 Promotions</h1>

      <div className="produits-filters">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={categorieId}
          onChange={(e) => setCategorieId(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nom}</option>
          ))}
        </select>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Trier par</option>
          <option value="prix_asc">Prix croissant</option>
          <option value="prix_desc">Prix décroissant</option>
        </select>
      </div>

      {!loading && produits.length > 0 && (
        <p className="produits-total">{produits.length} promotion{produits.length > 1 ? 's' : ''} trouvée{produits.length > 1 ? 's' : ''}</p>
      )}

      {loading ? (
        <p className="loading">Chargement...</p>
      ) : produits.length === 0 ? (
        <p className="no-produits">Aucune promotion ne correspond à votre recherche.</p>
      ) : (
        <div className="produits-grid">
          {produits.map(prod => (
            <div
              key={prod.id}
              className={`produit-card ${prod.quantite === 0 ? 'out-of-stock' : ''}`}
              onClick={() => navigate(`/produit/${prod.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="img-container">
                <ProductRibbon produit={prod} />
                <img src={prod.image} alt={prod.nom} className="produit-img" />
              </div>

              <div className="produit-info">
                <h3 className="produit-nom">{prod.nom}</h3>
                <p className="produit-prix"><PriceTag produit={prod} /></p>
                <button
                  className="btn-panier"
                  disabled={prod.quantite === 0}
                  onClick={(e) => { e.stopPropagation(); addToCart(prod); }}
                >
                  {prod.quantite === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;
