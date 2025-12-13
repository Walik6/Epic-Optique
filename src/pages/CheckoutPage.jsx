import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    telephone: '',
    commentaire: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [commandeEnvoyee, setCommandeEnvoyee] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = e => {
    let value = e.target.value;

    if (e.target.name === 'telephone') {
      value = value.replace(/[^\d+]/g, '');
    }

    setForm({ ...form, [e.target.name]: value });
  };

  const validateForm = () => {
    const nomRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nomRegex.test(form.nom)) {
      setMessage('❌ Nom invalide (pas de chiffres ni caractères spéciaux)');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ AJOUTÉ
      return false;
    }
    if (!nomRegex.test(form.prenom)) {
      setMessage('❌ Prénom invalide (pas de chiffres ni caractères spéciaux)');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ AJOUTÉ
      return false;
    }

    if (form.adresse.trim().length < 5) {
      setMessage('❌ Adresse trop courte (minimum 5 caractères)');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ AJOUTÉ
      return false;
    }

    const tel = form.telephone.trim();
    if (tel.startsWith('0')) {
      if (!/^0\d{9}$/.test(tel)) {
        setMessage('❌ Téléphone invalide : 10 chiffres requis si commence par 0');
        window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ AJOUTÉ
        return false;
      }
    } else if (tel.startsWith('+213')) {
      if (!/^\+213\d{9}$/.test(tel)) {
        setMessage('❌ Téléphone invalide : +213 suivi de 9 chiffres requis');
        window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ AJOUTÉ
        return false;
      }
    } else {
      setMessage('❌ Téléphone invalide : doit commencer par 0 ou +213');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ AJOUTÉ
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (loading || commandeEnvoyee) return;

    if (!validateForm()) {
      setTimeout(() => setMessage(''), 4000);
      return;
    }

    setLoading(true);

    const payload = {
      client: form,
      items: cart.map(p => ({
        produit_id: p.id,
        quantite: p.quantite,
        prix: p.prix
      })),
      total
    };

    try {
      const res = await fetch(`${API_URL}/createCommande.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        setMessage('✅ Commande envoyée avec succès !');
        setCommandeEnvoyee(true);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ AJOUTÉ - scroll en haut
        setTimeout(() => navigate('/'), 2500);
      } else {
        setMessage('❌ Erreur lors de la commande. Veuillez réessayer.');
        window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ AJOUTÉ
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Erreur serveur. Veuillez réessayer plus tard.');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ AJOUTÉ
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h1>Confirmation de commande</h1>

        {message && <div className={`checkout-message ${message.startsWith('❌') ? 'error' : 'success'}`}>{message}</div>}

        <input
          name="nom"
          placeholder="Nom"
          required
          value={form.nom}
          onChange={handleChange}
        />
        <input
          name="prenom"
          placeholder="Prénom"
          required
          value={form.prenom}
          onChange={handleChange}
        />
        <input
          name="adresse"
          placeholder="Adresse"
          required
          value={form.adresse}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="telephone"
          placeholder="Téléphone"
          required
          value={form.telephone}
          onChange={handleChange}
        />
        <textarea
          name="commentaire"
          placeholder="Commentaire (optionnel)"
          value={form.commentaire}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading || commandeEnvoyee}>
          {loading ? 'Envoi en cours...' : commandeEnvoyee ? 'Commande envoyée' : 'Confirmer'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;