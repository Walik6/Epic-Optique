import useSEO from '../hooks/useSEO';

export default function Home() {
  useSEO({
    title: 'Epic Optique — Lunettes, montures et lentilles en Algérie',
    description: 'Découvrez nos montures, lunettes de vue, lunettes de soleil et lentilles pour hommes, femmes et enfants chez Epic Optique.',
    url: 'https://epicoptique.com/'
  });

  return (
    <div style={{ padding: "40px" }}>
      <h1>Bienvenue chez Epic Optique</h1>
      <p>Découvrez nos montures, lentilles et accessoires.</p>
    </div>
  );
}
