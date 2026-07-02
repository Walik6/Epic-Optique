import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PromotionsPage.css';
import { useCart } from '../context/CartContext';
import useSEO from '../hooks/useSEO';
import PriceTag, { PromoBadge } from '../components/PriceTag';

const PromotionsPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useSEO({
    title: 'Promotions | Epic Optique',
    description: 'Profitez des promotions en cours chez Epic Optique sur nos montures et lunettes.',
    url: 'https://epicoptique.com/promotions'
  });

  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch(`${API_URL}/getProduits.php?promo=true`);
        const data = await res.json();
        setProduits(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur:', err);
        setProduits([]);
      }
      setLoading(false);
    };

    fetchPromotions();
  }, [API_URL]);

  return (
    <div className="produits-page">
      <h1 className="produits-title">🎉 Promotions</h1>

      {loading ? (
        <p className="loading">Chargement...</p>
      ) : produits.length === 0 ? (
        <p className="no-produits">Aucune promotion en cours pour le moment.</p>
      ) : (
        <div className="produits-grid">
          {produits.map(prod => (
            <div
              key={prod.id}
              className="produit-card"
              onClick={() => navigate(`/produit/${prod.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="img-container">
                <PromoBadge produit={prod} />
                <img src={prod.image} alt={prod.nom} className="produit-img" />
              </div>

              <div className="produit-info">
                <h3 className="produit-nom">{prod.nom}</h3>
                <p className="produit-prix"><PriceTag produit={prod} /></p>
                <button
                  className="btn-panier"
                  onClick={(e) => { e.stopPropagation(); addToCart(prod); }}
                >
                  Ajouter au panier
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
