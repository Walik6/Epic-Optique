import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../assets/LogoBlanc.png';
import { useCart } from '../context/CartContext';
import MiniCart from './MiniCart';

const Header = () => {
  const { cartCount } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  // Ferme le menu mobile et le mini-panier a chaque changement de page :
  // sans ca, l'un ou l'autre pouvait rester ouvert apres navigation et se
  // superposer au reste du header (ex: la croix de fermeture du menu par
  // dessus l'icone panier).
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMiniCartOpen(false);
    document.body.classList.remove('menu-open');
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => {
      const next = !prev;
      document.body.classList.toggle('menu-open', next);
      return next;
    });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  const toggleMiniCart = () => setIsMiniCartOpen(prev => !prev);

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo Epic Optique" className="logo-img" />
          <span className="logo-text">Epic Optique</span>
        </Link>
      </div>

      <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/" onClick={closeMobileMenu}>Accueil</Link>
        <Link to="/nouveautes" onClick={closeMobileMenu}>Nouveautés</Link>
        <Link to="/promotions" onClick={closeMobileMenu}>Promotions</Link>
        <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
        {isMobileMenuOpen && (
          <button className="close-menu" onClick={closeMobileMenu}><FaTimes size={24} /></button>
        )}
      </nav>

      <div className="cart-menu">
        <div className="cart-icon" onClick={toggleMiniCart}>
          <FaShoppingCart size={24} />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
        <div className="hamburger" onClick={toggleMobileMenu}>
          <FaBars size={24} />
        </div>
      </div>

      <MiniCart isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
    </header>
  );
};

export default Header;
