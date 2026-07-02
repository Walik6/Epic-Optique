import React from 'react';
import './PromotionsPage.css';
import useSEO from '../hooks/useSEO';

const PromotionsPage = () => {
  useSEO({
    title: 'Promotions | Epic Optique',
    description: 'Les promotions Epic Optique arrivent bientôt.',
    url: 'https://epicoptique.com/promotions'
  });

  return (
    <div className="promotions-page">
      <div className="construction-container">
        <div className="construction-icon">🚧</div>
        <h1>Page en construction</h1>
        <p className="construction-subtitle">Les promotions seront bientôt disponibles</p>
        
        <div className="construction-details">
          <div className="feature-item">
            <span className="feature-icon">🎉</span>
            <div>
              <h3>Promotions personnalisées</h3>
              <p>Obtenez des promotions exeptionnelles !</p>
            </div>
          </div>
          
        </div>

        <div className="coming-soon">
          <p>✨ Bientôt disponible ✨</p>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;