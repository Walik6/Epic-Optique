import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import PriceTag, { PromoBadge } from './PriceTag';
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
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
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
            className="carousel-card"
            onClick={() => navigate(`/produit/${p.id}`)}
          >
            <div className="carousel-card-image">
              <PromoBadge produit={p} />
              {p.image ? <img src={p.image} alt={p.nom} /> : <div className="carousel-card-noimage" />}
            </div>
            <h3>{p.nom}</h3>
            <PriceTag produit={p} />
            <button
              className="carousel-card-btn"
              onClick={(e) => { e.stopPropagation(); addToCart(p); }}
            >
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
