import React, { useState } from 'react';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    telephone: ''
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // envoyer les données à ton API PHP
    fetch('http://tonsite.com/api/submitOrder.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(form)
    }).then(res => res.json())
      .then(data => alert('Commande passée avec succès !'));
  };

  return (
    <div className="checkout-page">
      <h1>Validation de la commande</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
        <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
        <input type="text" name="adresse" placeholder="Adresse" onChange={handleChange} required />
        <input type="tel" name="telephone" placeholder="Téléphone" onChange={handleChange} required />
        <button type="submit">Confirmer la commande</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
