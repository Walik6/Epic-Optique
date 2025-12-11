import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProduitsPage.css';

/*import hommesImg1 from '../assets/Lunettes_hommes.jpg';
import femmesImg1 from '../assets/Lunettes_femmes.jpg';
import enfantsImg1 from '../assets/Lunettes_enfants.jpg';
import hommesImg2 from '../assets/Lunettes_hommes2.jpg';*/

const ProduitsPage = () => {/*
  const { categorie } = useParams();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allProduits = [
      { id: 1, nom: 'Monture A', categorie: 'hommes', prix: 120, image: hommesImg1 },
      { id: 2, nom: 'Monture B', categorie: 'femmes', prix: 130, image: femmesImg1 },
      { id: 3, nom: 'Monture C', categorie: 'enfants', prix: 90, image: enfantsImg1 },
      { id: 4, nom: 'Monture D', categorie: 'hommes', prix: 150, image: hommesImg2 },
    ];

    const filtered = allProduits.filter(p => p.categorie === categorie);
    setProduits(filtered);
    setLoading(false);
  }, [categorie]);

  if (loading) return <p>Chargement des produits...</p>;
  if (produits.length === 0) return <p>Aucun produit trouvé pour {categorie}.</p>;

  return (
    <div className="produits-page">
      <h1>Produits pour {categorie.charAt(0).toUpperCase() + categorie.slice(1)}</h1>
      <div className="produits-grid">
        {produits.map(prod => (
          <div key={prod.id} className="produit-card">
            <img src={prod.image} alt={prod.nom} />
            <h3>{prod.nom}</h3>
            <p>{prod.prix} €</p>
            <button>Ajouter au panier</button>
          </div>
        ))}
      </div>
    </div>
  );
*/};

export default ProduitsPage;
