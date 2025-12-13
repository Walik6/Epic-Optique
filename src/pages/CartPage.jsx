import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const { cart, total, increaseQty, decreaseQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Si panier vide
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>Mon panier</h1>
        <div className="empty-cart">
          <p>Votre panier est vide.</p>
          <button onClick={() => navigate('/produits')}>Voir les produits</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Mon panier</h1>

      <div className="cart-content">
        {/* Liste des produits */}
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.nom} />
              <div className="cart-info">
                <h3>{item.nom}</h3>
                <div className="qty-price">
                  <div className="qty-controls">
                    <button onClick={() => decreaseQty(item.id)}>-</button>
                    <span>{item.quantite}</span>
                    <button onClick={() => increaseQty(item.id)}>+</button>
                  </div>
                  <p>{(item.prix * item.quantite).toLocaleString('fr-FR')} DZD</p>
                </div>
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>×</button>
            </div>
          ))}
        </div>

        {/* Résumé de la commande */}
        <div className="cart-summary">
          <h2>Résumé de la commande</h2>
          <div className="summary-item">
            <span>Total :</span>
            <span>{total.toLocaleString('fr-FR')} DZD</span>
          </div>
          <button onClick={() => navigate('/checkout')}>Valider la commande</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
