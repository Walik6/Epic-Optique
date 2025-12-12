import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProduitsPage.css';

const ProduitsPage = () => {
  const { categorieId } = useParams();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [titreCategorie, setTitreCategorie] = useState('Montures');

  const API_URL = import.meta.env.VITE_API_URL;

  const categoriesMap = {
    1: 'Hommes',
    2: 'Femmes',
    3: 'Enfants'
  };

  useEffect(() => {
    const fetchProduits = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/getProduits.php?page=${page}&search=${encodeURIComponent(search)}&filter=${filter}`;
        if (categorieId) url += `&categorie=${categorieId}`;
        const res = await fetch(url);
        const data = await res.json();
        setProduits(Array.isArray(data) ? data : []);

        setTitreCategorie(
          categorieId && categoriesMap[categorieId]
            ? `Montures pour ${categoriesMap[categorieId]}`
            : 'Montures'
        );
      } catch (err) {
        setProduits([]);
      }
      setLoading(false);
    };

    fetchProduits();
  }, [categorieId, page, search, filter, API_URL]);

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => produits.length === 12 && setPage(page + 1);

  return (
    <div className="produits-page">
      <h1 className="produits-title">{titreCategorie}</h1>

      {/* Recherche + Filtre */}
      <div className="produits-filters">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="search-input"
        />
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          className="filter-select"
        >
          <option value="">Trier par</option>
          <option value="prix_asc">Prix croissant</option>
          <option value="prix_desc">Prix décroissant</option>
        </select>
      </div>

      {loading ? (
        <p className="loading">Chargement...</p>
      ) : (!produits || produits.length === 0) ? (
        <p className="no-produits">Aucun produit disponible pour cette catégorie.</p>
      ) : (
        <>
          <div className="produits-grid">
            {produits.map(prod => (
              <div key={prod.id} className="produit-card">
                <div className="img-container">
                  <img src={prod.image} alt={prod.nom} className="produit-img" />
                </div>
                <h3 className="produit-nom">{prod.nom}</h3>
                <p className="produit-prix">{prod.prix} DZD</p>
                <button className="btn-panier">Ajouter au panier</button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button onClick={handlePrev} disabled={page === 1}>Précédent</button>
            <span>Page {page}</span>
            <button onClick={handleNext} disabled={produits.length < 12}>Suivant</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProduitsPage;
