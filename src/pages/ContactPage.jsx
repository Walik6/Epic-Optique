import React from 'react';
import './ContactPage.css';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { FaWhatsapp } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <h1>Contactez-nous</h1>

      <div className="contact-info">
        <div className="info-item">
          <h3>Téléphone</h3>
          <a href="tel:+21321123456">+213 782 878 283</a>
        </div>

        <div className="info-item">
          <h3>Réseaux sociaux</h3>
          <div className="social-links">
            <a href="https://www.facebook.com/profile.php?id=61579613270684" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/epic_optique/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.tiktok.com/@epic.optique" target="_blank" rel="noopener noreferrer">
              <SiTiktok />
            </a>
            <a href="https://wa.me/213782878283" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <div className="info-item">
          <h3>Adresse</h3>
          <p>Bab Ezzouar, Alger, Algérie</p>
        </div>

        <div className="info-item">
          <h3>Horaires</h3>
          <p>10h - 20h tous les jours sauf le vendredi</p>
        </div>
      </div>

      <div className="map-container">
        <iframe
          title="Epic Optique Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3198.128309301791!2d3.181266875523767!3d36.71947957224618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128e51005a8b2469%3A0xe27b3f5b82831f37!2sEpic%20optique!5e0!3m2!1sfr!2sdz!4v1765546410286!5m2!1sfr!2sdz"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;
