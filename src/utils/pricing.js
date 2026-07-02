// Seule source de vérité pour détecter/calculer une promotion sur un produit.
// Un produit est "en promo" si prix_promo est défini, positif et strictement
// inférieur au prix normal.
export function getPromoInfo(produit) {
  const prix = Number(produit?.prix) || 0;
  const prixPromo = produit?.prix_promo != null ? Number(produit.prix_promo) : null;

  const hasPromo = prixPromo != null && prixPromo > 0 && prixPromo < prix;

  return {
    hasPromo,
    price: hasPromo ? prixPromo : prix,
    originalPrice: prix,
    discountPercent: hasPromo ? Math.round((1 - prixPromo / prix) * 100) : 0
  };
}
