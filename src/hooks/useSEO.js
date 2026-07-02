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

const JSON_LD_ID = 'seo-json-ld';

const setJsonLd = (data) => {
  let el = document.getElementById(JSON_LD_ID);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = JSON_LD_ID;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

// Met à jour le titre, les meta tags (description, Open Graph) et, si fourni,
// les données structurées Schema.org (JSON-LD) de la page courante. Pas de
// dépendance externe : le site est en CSR pur, donc ces balises ne servent
// qu'aux crawlers capables d'exécuter le JS et au partage sur les réseaux
// sociaux, pas à un premier rendu HTML statique.
export default function useSEO({ title, description, image, url, jsonLd }) {
  useEffect(() => {
    if (title) document.title = title;
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', url || window.location.href);
    setJsonLd(jsonLd);

    return () => setJsonLd(null);
  }, [title, description, image, url, jsonLd]);
}
