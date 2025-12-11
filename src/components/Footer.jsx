import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section about">
        <h3>Epic Optique</h3>
        <p>
          Epic Optique vous propose les meilleures montures<br />
          pour hommes, femmes et enfants<br />
          avec un service irréprochable.
        </p>
      </div>

      <div className="footer-section links">
        <h4>Liens rapides</h4>
        <ul>
          <li><a href="#home">Accueil</a></li>
          <li><a href="#nouveautes">Nouveautés</a></li>
          <li><a href="#promotions">Promotions</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>

      <div className="socials">
        <a href="https://www.facebook.com/profile.php?id=61579613270684" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
        <a href="https://www.instagram.com/epic_optique/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        <a href="https://www.tiktok.com/@epic.optique" target="_blank" rel="noopener noreferrer"><SiTiktok /></a>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Epic Optique. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
