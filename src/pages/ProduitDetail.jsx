import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProduitDetail.css';

const categoriesMap = {
  1: 'Hommes',
  2: 'Femmes',
  3: 'Enfants'
};

const ProduitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [produit, setProduit] = useState(null);
  const [images, setImages] = useState([]);
  const [imageActive, setImageActive] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProduit = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/getProduits.php?id=${id}`);
        
        if (!res.ok) {
          throw new Error('Produit introuvable');
        }

        const data = await res.json();
        
        if (data.produit) {
          setProduit(data.produit);
          
          // Récupérer les images du produit
          if (data.produit.images && Array.isArray(data.produit.images)) {
            setImages(data.produit.images);
          } else if (data.produit.image) {
            // Fallback: si pas d'array d'images, utiliser l'image principale
            setImages([{ image_url: data.produit.image, est_principale: 1 }]);
          }
        } else {
          navigate('/produits');
        }
      } catch (err) {
        console.error('Erreur:', err);
        navigate('/produits');
      }
      setLoading(false);
    };

    fetchProduit();
  }, [id, API_URL, navigate]);

  if (loading) return <p className="loading">Chargement...</p>;
  if (!produit) return null;

  const imagePrincipale = images.length > 0 ? images[imageActive].image_url : produit.image;

  return (
    <div className="produit-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Retour
      </button>
      
      <div className="produit-detail-container">
        <div className="img-section">
          {/* Image principale */}
          <div className="main-image-container">
            {imagePrincipale ? (
              <img 
                src={imagePrincipale} 
                alt={`${produit.nom} - Image ${imageActive + 1}`} 
                className="produit-detail-img" 
              />
            ) : (
              <div className="no-image">Pas d'image</div>
            )}
          </div>

          {/* Miniatures */}
          {images.length > 1 && (
            <div className="thumbnails-container">
              {images.map((img, index) => (
                <div
                  key={img.id || index}
                  className={`thumbnail ${imageActive === index ? 'active' : ''}`}
                  onClick={() => setImageActive(index)}
                >
                  <img 
                    src={img.image_url} 
                    alt={`${produit.nom} - Miniature ${index + 1}`}
                  />
                  {img.est_principale === 1 && (
                    <span className="badge-principale">★</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="info-section">
          <h1>{produit.nom}</h1>
          <p className="prix-detail">
            <strong>Prix :</strong> {produit.prix?.toLocaleString('fr-FR')} DZD
          </p>
          <p>
            <strong>Stock :</strong> {produit.quantite > 0 ? `${produit.quantite} disponible(s)` : 'Rupture de stock'}
          </p>
          <p>
            <strong>Catégorie :</strong> {produit.categorie_nom || categoriesMap[produit.categories_id] || '-'}
          </p>
          
          <button 
            className="btn-ajouter-panier"
            onClick={() => {
              addToCart(produit);
              alert('Produit ajouté au panier !');
            }}
            disabled={produit.quantite <= 0}
          >
            {produit.quantite > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProduitDetail;