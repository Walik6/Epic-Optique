import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategorySection.css';
import hommesImg from '../assets/Lunettes_hommes.jpg';
import femmesImg from '../assets/Lunettes_femmes.jpg';
import enfantsImg from '../assets/Lunettes_enfants.jpg';

const CategorySection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categorie) => {
    navigate(`/produits/${categorie}`); // <-- ici on met :categorie
  };

  return (
    <section className="categories">
      <div
        id="hommes"
        className="category"
        style={{ backgroundImage: `url(${hommesImg})` }}
        onClick={() => handleCategoryClick('hommes')}
      >
        <span className="category-text">Hommes</span>
      </div>

      <div
        id="femmes"
        className="category"
        style={{ backgroundImage: `url(${femmesImg})` }}
        onClick={() => handleCategoryClick('femmes')}
      >
        <span className="category-text">Femmes</span>
      </div>

      <div
        id="enfants"
        className="category"
        style={{ backgroundImage: `url(${enfantsImg})` }}
        onClick={() => handleCategoryClick('enfants')}
      >
        <span className="category-text">Enfants</span>
      </div>
    </section>
  );
};

export default CategorySection;
