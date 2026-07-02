import React, { useEffect, useState } from 'react';
import { FaWallet, FaCalendarDay, FaCalendarAlt } from 'react-icons/fa';
import './VentesPage.css';
import useAdminAuth from '../hooks/useAdminAuth';

const VentesPage = () => {
  useAdminAuth();

  const [ventes, setVentes] = useState([]);
  const [stats, setStats] = useState({
    total_ca: 0,
    ventes_aujourd_hui: 0,
    ca_aujourd_hui: 0,
    ventes_mois: 0,
    ca_mois: 0
  });
  const [filterDate, setFilterDate] = useState('all');
  const [selectedVente, setSelectedVente] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const itemsPerPage = 15;

  useEffect(() => {
    loadVentes();
    loadStats();
  }, [filterDate, currentPage]);

  // Empêcher le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (selectedVente) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedVente]);

  const loadVentes = () => {
    const params = new URLSearchParams();
    params.append('page', currentPage);
    params.append('limit', itemsPerPage);
    if (filterDate !== 'all') params.append('filter', filterDate);

    fetch(`${API_URL}/getVentes.php?${params.toString()}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.ventes) {
          setVentes(data.ventes);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch(err => console.error(err));
  };

  const loadStats = () => {
    fetch(`${API_URL}/getStatVentes.php`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(err => console.error(err));
  };

  const voirDetails = async (venteId) => {
    try {
      const res = await fetch(`${API_URL}/getVentes.php?id=${venteId}`, { credentials: 'include' });
      const data = await res.json();
      if (data.vente) {
        setSelectedVente(data.vente);
        setIsClosing(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedVente(null);
      setIsClosing(false);
    }, 200); // Durée de l'animation
  };

  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedVente) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedVente]);

  return (
    <div className="ventes-page">
      <h1>Récapitulatif des Ventes</h1>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon"><FaWallet size={18} /></div>
          <div className="stat-info">
            <h3>Chiffre d'Affaires Total</h3>
            <p className="stat-value">{stats.total_ca.toLocaleString('fr-FR')} DZD</p>
          </div>
        </div>

        <div className="stat-card today">
          <div className="stat-icon"><FaCalendarDay size={18} /></div>
          <div className="stat-info">
            <h3>Aujourd'hui</h3>
            <p className="stat-value">{stats.ca_aujourd_hui.toLocaleString('fr-FR')} DZD</p>
            <p className="stat-detail">{stats.ventes_aujourd_hui} vente(s)</p>
          </div>
        </div>

        <div className="stat-card month">
          <div className="stat-icon"><FaCalendarAlt size={18} /></div>
          <div className="stat-info">
            <h3>Ce Mois</h3>
            <p className="stat-value">{stats.ca_mois.toLocaleString('fr-FR')} DZD</p>
            <p className="stat-detail">{stats.ventes_mois} vente(s)</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters">
        <select value={filterDate} onChange={(e) => {
          setFilterDate(e.target.value);
          setCurrentPage(1);
        }}>
          <option value="all">Toutes les ventes</option>
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
        </select>
      </div>

      {/* Liste des ventes */}
      <div className="ventes-table-container">
        <table className="ventes-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Heure</th>
              <th>Nombre d'articles</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ventes.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">Aucune vente trouvée</td>
              </tr>
            ) : (
              ventes.map(v => (
                <tr key={v.id}>
                  <td>{new Date(v.date_vente).toLocaleDateString('fr-FR')}</td>
                  <td>{new Date(v.date_vente).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{v.nombre_articles}</td>
                  <td className="total-cell">{parseFloat(v.total).toLocaleString('fr-FR')} DZD</td>
                  <td>
                    <button className="details-btn" onClick={() => voirDetails(v.id)}>
                      👁️ Détails
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
            disabled={currentPage <= 1}
          >
            ← Précédent
          </button>
          <span>Page {currentPage} / {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
            disabled={currentPage >= totalPages}
          >
            Suivant →
          </button>
        </div>
      )}

      {/* Modal Détails - VERSION AMÉLIORÉE */}
      {selectedVente && (
        <div 
          className={`modal-overlay ${isClosing ? 'closing' : ''}`}
          onClick={closeModal}
        >
          <div 
            className={`details-modal ${isClosing ? 'closing' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            {/* En-tête avec bouton de fermeture */}
            <div className="modal-header">
              <h2>🧾 Détails de la vente</h2>
              <button 
                className="close-btn" 
                onClick={closeModal}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            {/* Contenu scrollable */}
            <div className="modal-content">
              {/* Informations de la vente */}
              <div className="vente-info">
                <strong>Date:</strong>
                <span>{new Date(selectedVente.date_vente).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                
                <strong>Heure:</strong>
                <span>{new Date(selectedVente.date_vente).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}</span>
              </div>

              {/* Articles vendus */}
              <div className="details-items">
                <h3>Articles vendus</h3>
                {selectedVente.details.map((item, index) => (
                  <div key={index} className="detail-item">
                    <div className="detail-name">
                      <strong>{item.produit_nom}</strong>
                      <span>Quantité: {item.quantite} × {parseFloat(item.prix_unitaire).toLocaleString('fr-FR')} DZD</span>
                    </div>
                    <div className="detail-prix">
                      {(parseFloat(item.prix_unitaire) * parseInt(item.quantite)).toLocaleString('fr-FR')} DZD
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="details-total">
                <strong>Total de la vente:</strong>
                <strong>{parseFloat(selectedVente.total).toLocaleString('fr-FR')} DZD</strong>
              </div>
            </div>

            {/* Actions (bouton fermer) */}
            <div className="modal-actions">
              <button onClick={closeModal}>✓ Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VentesPage;
