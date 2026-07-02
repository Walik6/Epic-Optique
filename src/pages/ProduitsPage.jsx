import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProduitsPage.css';
import { useCart } from '../context/CartContext';
import useSEO from '../hooks/useSEO';
import PriceTag, { PromoBadge } from '../components/PriceTag';

const ProduitsPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useSEO({
    title: 'Nos produits | Epic Optique',
    description: 'Parcourez le catalogue Epic Optique : montures, lunettes de vue et de soleil pour hommes, femmes et enfants.',
    url: 'https://epicoptique.com/produits'
  });

  const { categorieId } = useParams();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [titreCategorie, setTitreCategorie] = useState('Montures');
  const [totalPages, setTotalPages] = useState(1);

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
        let url = `${API_URL}/getProduits.php?page=${page}&limit=12&search=${encodeURIComponent(search)}&filter=${filter}`;
        if (categorieId) url += `&categorie=${categorieId}`;
        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data.produits)) {
          setProduits(data.produits);
          setTotalPages(data.totalPages || 1);
        } else {
          setProduits(Array.isArray(data) ? data : []);
          setTotalPages(1);
        }

        setTitreCategorie(
          categorieId && categoriesMap[categorieId]
            ? `Montures pour ${categoriesMap[categorieId]}`
            : 'Montures'
        );
      } catch (err) {
        setProduits([]);
        setTotalPages(1);
      }
      setLoading(false);
    };

    fetchProduits();
  }, [categorieId, page, search, filter, API_URL]);

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

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
              <div
                key={prod.id}
                className="produit-card"
                onClick={() => navigate(`/produit/${prod.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="img-container">
                  <PromoBadge produit={prod} />
                  <img src={prod.image} alt={prod.nom} className="produit-img" />
                </div>

                <div className="produit-info">
                  <h3 className="produit-nom">{prod.nom}</h3>
                  <p className="produit-prix"><PriceTag produit={prod} /></p>
                  <button
                    className="btn-panier"
                    onClick={(e) => { e.stopPropagation(); addToCart(prod); }}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button onClick={handlePrev} disabled={page === 1}>← Précédent</button>
            <span>Page {page} / {totalPages}</span>
            <button onClick={handleNext} disabled={page >= totalPages}>Suivant →</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProduitsPage;
