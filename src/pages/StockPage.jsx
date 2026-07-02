import React, { useEffect, useState } from 'react';
import { FaPen, FaTrash, FaImage, FaPlus, FaMinus, FaSearch, FaTimes, FaCamera, FaStar } from 'react-icons/fa';
import './StockPage.css';
import useAdminAuth from '../hooks/useAdminAuth';
import PriceTag, { PromoBadge } from '../components/PriceTag';

const EMPTY_FORM = { id:'', nom:'', prix:'', quantite:'', categorieId:'', enPromo: false, prixPromo: '' };

const StockPage = () => {
  useAdminAuth();

  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [produitImages, setProduitImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const itemsPerPage = 12;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/getCategories.php`)
      .then(res => res.json())
      .then(setCategories);
  }, [API_URL]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('page', currentPage);
    params.append('limit', itemsPerPage);
    params.append('show_out_of_stock', 'true');
    if (searchTerm) params.append('search', searchTerm);
    if (filterCategory) params.append('categorie', filterCategory);

    fetch(`${API_URL}/getProduits.php?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        let produitsArray = [];
        let pages = 1;
        
        if (data.produits && Array.isArray(data.produits)) {
          produitsArray = data.produits;
          pages = data.totalPages || 1;
        } else if (Array.isArray(data)) {
          produitsArray = data;
        }
        
        const produitsAvecCategorie = produitsArray.map(p => {
          const cat = categories.find(c => c.id === p.categorie_id);
          return { ...p, categorie_nom: cat ? cat.nom : '-' };
        });
        
        setProduits(produitsAvecCategorie);
        setTotalPages(pages);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(err => {
        console.error('Erreur chargement produits:', err);
      });
  }, [currentPage, searchTerm, filterCategory, categories, API_URL]);

  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleFilterChange = e => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = produitImages.length + selectedFiles.length + files.length;
    
    if (totalImages > 5) {
      alert('Maximum 5 images par produit');
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const deleteExistingImage = async (imageId) => {
    if (!window.confirm('Supprimer cette image ?')) return;

    try {
      const res = await fetch(`${API_URL}/deleteImage.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_id: imageId })
      });

      const data = await res.json();
      if (data.success) {
        setProduitImages(prev => prev.filter(img => img.id !== imageId));
        setMessage('✅ Image supprimée');
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  const setMainImage = async (imageId) => {
    try {
      const res = await fetch(`${API_URL}/setMainImage.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_id: imageId })
      });

      const data = await res.json();
      if (data.success) {
        setProduitImages(prev => prev.map(img => ({
          ...img,
          est_principale: img.id === imageId ? 1 : 0
        })));
        setMessage('✅ Image principale définie');
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadProduitImages = async (produitId) => {
    try {
      const res = await fetch(`${API_URL}/getProduits.php?id=${produitId}`);
      const data = await res.json();
      if (data.produit && data.produit.images) {
        setProduitImages(data.produit.images);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const isEdit = form.id && form.id !== '';
      const url = isEdit ? `${API_URL}/updateProduit.php` : `${API_URL}/addProduit.php`;

      if (form.enPromo && form.prixPromo && parseFloat(form.prixPromo) >= parseFloat(form.prix)) {
        alert('Le prix promo doit être inférieur au prix normal');
        return;
      }

      const body = {
        nom: form.nom,
        prix: parseFloat(form.prix),
        prixPromo: form.enPromo && form.prixPromo ? parseFloat(form.prixPromo) : null,
        quantite: parseInt(form.quantite),
        categorieId: parseInt(form.categorieId)
      };

      if (isEdit) {
        body.id = parseInt(form.id);
      }

      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (data.success) {
        const produitId = form.id || data.produit.id;

        if (selectedFiles.length > 0) {
          setUploading(true);

          try {
            const imagesBase64 = await Promise.all(
              selectedFiles.map(file => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    resolve({
                      filename: file.name,
                      data: reader.result.split(',')[1],
                      type: file.type
                    });
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });
              })
            );

            const uploadRes = await fetch(`${API_URL}/uploadImagesBase64.php`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                produit_id: produitId,
                images: imagesBase64
              })
            });

            if (!uploadRes.ok) {
              throw new Error(`Erreur HTTP ${uploadRes.status}`);
            }

            const uploadData = await uploadRes.json();
            setUploading(false);

            if (!uploadData.success) {
              alert('⚠️ Produit sauvegardé mais erreur upload images: ' + uploadData.error);
              closeModal();
              setTimeout(() => window.location.reload(), 1000);
              return;
            }

          } catch (uploadErr) {
            setUploading(false);
            alert('⚠️ Produit sauvegardé mais images non uploadées: ' + uploadErr.message);
            closeModal();
            setTimeout(() => window.location.reload(), 1000);
            return;
          }
        }

        closeModal();
        setMessage(isEdit ? '✅ Produit modifié' : '✅ Produit ajouté');
        setTimeout(() => window.location.reload(), 1000);

      } else {
        alert('Erreur: ' + data.error);
      }

    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const deleteProduit = async id => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    try {
      const res = await fetch(`${API_URL}/deleteProduit.php`, {
        method:'POST',
        credentials: 'include',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id})
      });
      const data = await res.json();
      if (data.success) {
        setProduits(prev => prev.filter(p => p.id !== id));
        setMessage('✅ Produit supprimé');
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantite = async (id, quantite) => {
    if (quantite < 0) return;
    try {
      const res = await fetch(`${API_URL}/updateProduit.php`, {
        method:'POST',
        credentials: 'include',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ id, quantite })
      });
      const data = await res.json();
      if (data.success) {
        setProduits(prev => prev.map(p => p.id === id ? {...p, quantite} : p));
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(EMPTY_FORM);
    setProduitImages([]);
    setSelectedFiles([]);
  };

  const openEditModal = async (produit) => {
    setForm({
      id: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      quantite: produit.quantite,
      categorieId: produit.categorie_id,
      enPromo: produit.prix_promo != null,
      prixPromo: produit.prix_promo ?? ''
    });

    if (produit.id) {
      await loadProduitImages(produit.id);
    }
    setModalOpen(true);
  };

  return (
    <div className="stock-page">
      <h1>Gestion du Stock</h1>
      {message && <div className="admin-notification">{message}</div>}

      <div className="search-filter">
        <div className="stock-filters">
          <div className="stock-search-input">
            <FaSearch size={13} />
            <input
              placeholder="Recherche..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <select value={filterCategory} onChange={handleFilterChange}>
            <option value="">Toutes les catégories</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nom}</option>)}
          </select>
        </div>
        <button className="admin-btn primary" onClick={() => {
          setForm(EMPTY_FORM);
          setProduitImages([]);
          setSelectedFiles([]);
          setModalOpen(true);
        }}>
          <FaPlus size={12} /> Ajouter Produit
        </button>
      </div>

      {produits.length === 0 ? (
        <p className="empty-state">Aucun produit trouvé.</p>
      ) : (
      <div className="stock-grid">
        {produits.map(p => (
          <div key={p.id} className={`stock-card ${p.quantite === 0 ? 'out-of-stock' : ''}`}>
            <div className="stock-card-image">
              <PromoBadge produit={p} />
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.nom}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23ddd" width="60" height="60"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3E?%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="stock-card-noimage"><FaImage size={22} /></div>
              )}
              {p.quantite === 0 && <span className="stock-card-badge">Rupture</span>}
            </div>

            <div className="stock-card-body">
              {p.categorie_nom && <span className="stock-card-category">{p.categorie_nom}</span>}
              <h3>{p.nom}</h3>
              <p className="stock-card-price"><PriceTag produit={p} compact /></p>

              <div className="stock-card-qty">
                <button onClick={() => updateQuantite(p.id, p.quantite - 1)} disabled={p.quantite <= 0} aria-label="Diminuer">
                  <FaMinus size={10} />
                </button>
                <span className={p.quantite === 0 ? 'zero-stock' : ''}>{p.quantite}</span>
                <button onClick={() => updateQuantite(p.id, p.quantite + 1)} aria-label="Augmenter">
                  <FaPlus size={10} />
                </button>
              </div>
            </div>

            <div className="stock-card-actions">
              <button className="admin-btn secondary" onClick={() => openEditModal(p)}>
                <FaPen size={12} /> Modifier
              </button>
              <button className="admin-btn danger" onClick={() => deleteProduit(p.id)} aria-label="Supprimer">
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      <div className="admin-pagination">
        <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage <= 1}>Précédent</button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage >= totalPages}>Suivant</button>
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal large" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={closeModal} aria-label="Fermer"><FaTimes size={14} /></button>
            <h2>{form.id ? 'Modifier Produit' : 'Ajouter Produit'}</h2>
            <form className="modal-form" onSubmit={handleSubmit}>
              <input name="nom" placeholder="Nom produit" value={form.nom} onChange={handleChange} required/>
              <input type="number" name="prix" placeholder="Prix" value={form.prix} onChange={handleChange} required/>
              <input type="number" name="quantite" placeholder="Quantité" value={form.quantite} onChange={handleChange} required/>

              <label className="promo-toggle">
                <input type="checkbox" name="enPromo" checked={form.enPromo} onChange={handleChange} />
                En promotion
              </label>

              {form.enPromo && (
                <input
                  type="number"
                  name="prixPromo"
                  placeholder="Prix promo"
                  value={form.prixPromo}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              )}

              <select 
                name="categorieId" 
                value={form.categorieId || ''}
                onChange={handleChange} 
                required
              >
                <option value="">Choisir catégorie</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nom}</option>)}
              </select>

              <div className="images-section">
                <label>Images (max 5)</label>
                
                {produitImages.length > 0 && (
                  <div className="existing-images">
                    <p>Images actuelles :</p>
                    <div className="images-grid">
                      {produitImages.map(img => (
                        <div key={img.id} className="image-item">
                          <img src={img.image_url} alt="Produit" />
                          <div className="image-actions">
                            {img.est_principale ? (
                              <span className="main-badge"><FaStar size={10} /> Principale</span>
                            ) : (
                              <button type="button" onClick={() => setMainImage(img.id)}>
                                Définir principale
                              </button>
                            )}
                            <button type="button" className="delete-img-btn" onClick={() => deleteExistingImage(img.id)}>
                              <FaTrash size={10} /> Supprimer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFiles.length > 0 && (
                  <div className="selected-files">
                    <p>Nouvelles images à uploader :</p>
                    <div className="files-list">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="file-item">
                          <span>{file.name}</span>
                          <button type="button" onClick={() => removeSelectedFile(index)}><FaTimes size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(produitImages.length + selectedFiles.length) < 5 && (
                  <div className="upload-area">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload" className="upload-btn">
                      <FaCamera size={13} /> Ajouter des images
                    </label>
                  </div>
                )}
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-btn secondary" onClick={closeModal}>Annuler</button>
                <button type="submit" className="admin-btn primary" disabled={uploading}>
                  {uploading ? '⏳ Upload en cours...' : (form.id ? 'Modifier' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPage;