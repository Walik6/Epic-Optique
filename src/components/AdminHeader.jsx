import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './AdminHeader.css';
import logo from '../assets/LogoBlanc.png';

const AdminHeader = ({ onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/admin" className="logo-link">
          <img src={logo} alt="Logo Epic Optique" className="logo-img" />
          <span className="logo-text">Epic Optique Admin</span>
        </Link>
      </div>

      <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/overview">Dashboard</Link>
        <Link to="/stock">Stock</Link>
        <Link to="/caisse">Caisse</Link>
        <Link to="/admin">Commandes</Link>
        <Link to="/ventes">Ventes</Link>
      </nav>

      <div className="cart-menu">
        <button className="logout-btn" onClick={onLogout}>Déconnexion</button>
        <div className="hamburger" onClick={toggleMobileMenu}>
          <FaBars size={24} />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
