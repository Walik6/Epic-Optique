import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate(); // Hook pour naviguer

  const handleClick = () => {
    navigate('/produits'); // redirige vers la page produits
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Epic Optique</h1>
        <p>Pour une vision épique au quotidien</p>
        <button onClick={handleClick}>Découvrir nos montures</button>
      </div>
    </section>
  );
};

export default HeroSection;
