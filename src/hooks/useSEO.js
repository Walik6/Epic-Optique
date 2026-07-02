import { useEffect } from 'react';

const setMetaTag = (attr, key, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

// Met à jour le titre et les meta tags (description, Open Graph) de la page
// courante. Pas de dépendance externe : le site est en CSR pur, donc ces
// balises ne servent qu'aux crawlers capables d'exécuter le JS et au
// partage sur les réseaux sociaux, pas à un premier rendu HTML statique.
export default function useSEO({ title, description, image, url }) {
  useEffect(() => {
    if (title) document.title = title;
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', url || window.location.href);
  }, [title, description, image, url]);
}
