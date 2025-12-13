import React, { useState } from 'react';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/LogoBlanc.png';
import { useCart } from '../context/CartContext';
import MiniCart from './MiniCart';

const Header = () => {
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle('menu-open'); // bloque le scroll arrière
  };

  const toggleMiniCart = () => setIsMiniCartOpen(!isMiniCartOpen);

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo Epic Optique" className="logo-img" />
          <span className="logo-text">Epic Optique</span>
        </Link>
      </div>

      <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/" onClick={toggleMobileMenu}>Accueil</Link>
        <Link to="/nouveautes" onClick={toggleMobileMenu}>Nouveautés</Link>
        <Link to="/promotions" onClick={toggleMobileMenu}>Promotions</Link>
        <Link to="/contact" onClick={toggleMobileMenu}>Contact</Link>
        {isMobileMenuOpen && (
          <button className="close-menu" onClick={toggleMobileMenu}><FaTimes size={24} /></button>
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
