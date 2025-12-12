import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Colonne gauche */}
        <div className="footer-left">
          <h3>Epic Optique</h3>
          <p className="footer-desc">
            Epic Optique vous propose les meilleures montures<br />
            pour hommes, femmes et enfants<br />
            avec un service irréprochable.
          </p>
        </div>

        {/* Colonne centre */}
        <div className="footer-center">
          <h4>Liens rapides</h4>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="#nouveautes">Nouveautés</a></li>
            <li><a href="#promotions">Promotions</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Colonne droite */}
        <div className="footer-right">
          <p className="footer-phone">
            <FaPhoneAlt /> <a href="tel:+213782878283">+213 78 28 78 283</a>
          </p>
          <div className="socials">
            <a href="https://www.facebook.com/profile.php?id=61579613270684" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://www.instagram.com/epic_optique/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.tiktok.com/@epic.optique" target="_blank" rel="noopener noreferrer"><SiTiktok /></a>
            <a href="https://wa.me/213782878283" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Epic Optique. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
