import { useEffect, useState } from 'react';
import useSEO from '../hooks/useSEO';
import HeroSection from '../components/HeroSection';
import TrustBar from '../components/TrustBar';
import CategorySection from '../components/CategorySection';
import ProductCarousel from '../components/ProductCarousel';

export default function Home() {
  useSEO({
    title: 'Epic Optique — Lunettes, montures et lentilles en Algérie',
    description: 'Découvrez nos montures, lunettes de vue, lunettes de soleil et lentilles pour hommes, femmes et enfants chez Epic Optique.',
    url: 'https://epicoptique.com/'
  });

  const [nouveautes, setNouveautes] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/getProduits.php?show_out_of_stock=true`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setNouveautes([...list].sort((a, b) => b.id - a.id).slice(0, 12));
      })
      .catch(() => setNouveautes([]));

    fetch(`${API_URL}/getProduits.php?promo=true&show_out_of_stock=true`)
      .then(res => res.json())
      .then(data => setPromotions(Array.isArray(data) ? data : []))
      .catch(() => setPromotions([]));
  }, [API_URL]);

  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategorySection />
      <ProductCarousel title="Promotions" produits={promotions} />
      <ProductCarousel title="Nouveautés" produits={nouveautes} />
    </>
  );
}
