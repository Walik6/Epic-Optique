import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css'; // tu peux créer ton style

const NotFoundPage = () => {
  return (
    <div className="notfound-page">
      <h1>404</h1>
      <h2>Oups ! Cette page n’existe pas.</h2>
      <p>La page que vous recherchez est introuvable.</p>
      <Link to="/" className="btn-home">Retour à l’accueil</Link>
    </div>
  );
};

export default NotFoundPage;
