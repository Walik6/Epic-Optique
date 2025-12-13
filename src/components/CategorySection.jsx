import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategorySection.css';

const CategorySection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/getCategories.php`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur API catégories:", err);
        setLoading(false);
      });
  }, [API_URL]);

  const handleCategoryClick = (categorieId) => {
    navigate(`/produits/categorie/${categorieId}`); // ✅ CHANGEMENT ICI
  };

  if (loading) return <p>Chargement des catégories...</p>;

  return (
    <section className="categories">
      {categories.map(cat => (
        <div
          key={cat.id}
          className="category"
          style={{ backgroundImage: `url(${API_URL}${cat.image_url || '/uploads/default.jpg'})` }}
          onClick={() => handleCategoryClick(cat.id)}
        >
          <span className="category-text">{cat.nom}</span>
        </div>
      ))}
    </section>
  );
};

export default CategorySection;