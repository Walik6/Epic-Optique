import React, { useState } from 'react';
import { FaShoppingCart, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/LogoBlanc.png';

const Header = () => {
  const [cartCount, setCartCount] = useState(3);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      {/* Logo + texte */}
      <div className="logo-container">
        <img src={logo} alt="Logo Epic Optique" className="logo-img" />
        <span className="logo-text">Epic Optique</span>
      </div>

      {/* Navigation */}
      <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/">Accueil</Link>
        <Link to="/produits/hommes">Hommes</Link>
        <Link to="/produits/femmes">Femmes</Link>
        <Link to="/produits/enfants">Enfants</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      {/* Panier + hamburger */}
      <div className="cart-menu">
        <div className="cart-icon">
          <FaShoppingCart size={24} />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>

        <div className="hamburger" onClick={toggleMobileMenu}>
          <FaBars size={24} />
        </div>
      </div>
    </header>
  );
};

export default Header;
