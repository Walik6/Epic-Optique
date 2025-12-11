import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProduitsPage.css';

const ProduitsPage = () => {
  const { categorie } = useParams();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://tonsite.com/api/getProduits.php?categorie=${categorie}`)
      .then(res => res.json())
      .then(data => {
        setProduits(data);
        setLoading(false);
      });
  }, [categorie]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="produits-page">
      <h1>Produits pour {categorie}</h1>
      <div className="produits-grid">
        {produits.map(prod => (
          <div key={prod.id} className="produit-card">
            <img src={prod.image_url} alt={prod.nom} />
            <h3>{prod.nom}</h3>
            <p>{prod.prix} €</p>
            <button>Ajouter au panier</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProduitsPage;
