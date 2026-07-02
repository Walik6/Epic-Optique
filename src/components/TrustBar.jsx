import React from 'react';
import { FaTruck, FaMoneyBillWave, FaHeadset, FaShieldAlt } from 'react-icons/fa';
import './TrustBar.css';

const ITEMS = [
  { icon: FaTruck, label: 'Livraison partout en Algérie' },
  { icon: FaMoneyBillWave, label: 'Paiement à la livraison' },
  { icon: FaShieldAlt, label: 'Produits garantis' },
  { icon: FaHeadset, label: 'Support client réactif' },
];

const TrustBar = () => (
  <section className="trust-bar">
    {ITEMS.map(({ icon: Icon, label }) => (
      <div key={label} className="trust-item">
        <Icon size={20} />
        <span>{label}</span>
      </div>
    ))}
  </section>
);

export default TrustBar;
