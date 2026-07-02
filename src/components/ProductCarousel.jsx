import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import PriceTag, { ProductRibbon } from './PriceTag';
import './ProductCarousel.css';

// Carrousel de produits en scroll horizontal natif (scroll-snap), sans
// dependance externe. Ne s'affiche pas si la liste est vide.
export default function ProductCarousel({ title, produits }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  if (!produits || produits.length === 0) return null;

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    // Fait defiler d'une page complete (les produits visibles), pas d'un
    // simple pas partiel.
    el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <section className="product-carousel">
      <div className="product-carousel-header">
        <h2>{title}</h2>
        <div className="product-carousel-nav">
          <button onClick={() => scroll(-1)} aria-label="Précédent"><FaChevronLeft /></button>
          <button onClick={() => scroll(1)} aria-label="Suivant"><FaChevronRight /></button>
        </div>
      </div>

      <div className="product-carousel-track" ref={scrollRef}>
        {produits.map(p => (
          <div
            key={p.id}
            className={`carousel-card ${p.quantite === 0 ? 'out-of-stock' : ''}`}
            onClick={() => navigate(`/produit/${p.id}`)}
          >
            <div className="carousel-card-image">
              <ProductRibbon produit={p} />
              {p.image ? <img src={p.image} alt={p.nom} /> : <div className="carousel-card-noimage" />}
            </div>
            <h3>{p.nom}</h3>
            <PriceTag produit={p} />
            <button
              className="carousel-card-btn"
              disabled={p.quantite === 0}
              onClick={(e) => { e.stopPropagation(); addToCart(p); }}
            >
              {p.quantite === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
