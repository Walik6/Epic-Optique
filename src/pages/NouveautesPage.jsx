import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NouveautesPage.css';
import { useCart } from '../context/CartContext';
import useSEO from '../hooks/useSEO';
import PriceTag, { ProductRibbon } from '../components/PriceTag';

const NouveautesPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useSEO({
    title: 'Nouveautés | Epic Optique',
    description: 'Découvrez les derniers modèles de montures et lunettes ajoutés chez Epic Optique.',
    url: 'https://epicoptique.com/nouveautes'
  });

  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  const NOMBRE_NOUVEAUTES = 12; // Afficher les 12 derniers produits

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await fetch(`${API_URL}/getProduits.php?show_out_of_stock=true`);
        const data = await res.json();
        setProduits(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur:', err);
        setProduits([]);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/getCategories.php`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur:', err);
        setCategories([]);
      }
    };

    fetchProduits();
    fetchCategories();
  }, [API_URL]);

  // Obtenir les 12 derniers produits (IDs les plus élevés), rupture de stock incluse
  const getNouveautes = () => {
    if (produits.length === 0) return [];
    
    // Trier par ID décroissant (plus grand ID = plus récent)
    let sorted = [...produits].sort((a, b) => b.id - a.id);
    
    // Prendre les 12 premiers
    return sorted.slice(0, NOMBRE_NOUVEAUTES);
  };

  const nouveautes = getNouveautes();

  return (
    <div className="produits-page">
      <h1 className="produits-title">✨ Nouveautés</h1>

      {nouveautes.length === 0 ? (
        <p className="loading">Chargement des nouveautés...</p>
      ) : (
        <div className="produits-grid">
          {nouveautes.map(prod => (
            <div
              key={prod.id}
              className={`produit-card ${prod.quantite === 0 ? 'out-of-stock' : ''}`}
              onClick={() => navigate(`/produit/${prod.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="new-badge-top">✨ NOUVEAU</div>

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

export default NouveautesPage;