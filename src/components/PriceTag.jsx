import { getPromoInfo } from '../utils/pricing';
import './PriceTag.css';

// Badge coin -XX% a placer dans un conteneur `position: relative` (ex:
// l'image du produit), meme convention que le badge "NOUVEAU" existant.
export function PromoBadge({ produit }) {
  const { hasPromo, discountPercent } = getPromoInfo(produit);
  if (!hasPromo) return null;
  return <span className="promo-badge">-{discountPercent}%</span>;
}

// Affichage du prix : juste le prix si pas de promo, sinon ancien prix barre
// + nouveau prix en couleur.
export default function PriceTag({ produit, compact = false }) {
  const { hasPromo, price, originalPrice } = getPromoInfo(produit);

  if (!hasPromo) {
    return <span className="price-tag">{price.toLocaleString('fr-FR')} DZD</span>;
  }

  return (
    <span className={`price-tag has-promo ${compact ? 'compact' : ''}`}>
      <span className="price-tag-original">{originalPrice.toLocaleString('fr-FR')} DZD</span>
      <span className="price-tag-current">{price.toLocaleString('fr-FR')} DZD</span>
    </span>
  );
}
