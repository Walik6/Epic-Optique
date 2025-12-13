import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './MiniCart.css';

const MiniCart = ({ isOpen, onClose }) => {
  const { cart, total, increaseQty, decreaseQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="mini-cart-overlay" onClick={onClose}>
      <div className="mini-cart" onClick={e => e.stopPropagation()}>
        <h2>Mon Panier</h2>

        {cart.length === 0 ? (
          <p>Votre panier est vide</p>
        ) : (
          <>
            <div className="mini-cart-items">
              {cart.map(item => (
                <div key={item.id} className="mini-cart-item">
                  <img src={item.image} alt={item.nom} />
                  <div className="mini-cart-info">
                    <h4>{item.nom}</h4>
                    <p>{item.prix} DZD</p>
                    <div className="mini-qty">
                      <button onClick={() => decreaseQty(item.id)}>-</button>
                      <span>{item.quantite}</span>
                      <button onClick={() => increaseQty(item.id)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Supprimer</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mini-cart-footer">
              <h3>Total : {total} DZD</h3>
              <button onClick={() => { navigate('/cart'); onClose(); }}>Voir le panier</button>
              <button onClick={() => { navigate('/checkout'); onClose(); }}>Valider la commande</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MiniCart;
