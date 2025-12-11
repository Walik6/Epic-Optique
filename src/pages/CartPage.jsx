import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // récupérer le panier depuis localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (id, qty) => {
    const newCart = cart.map(item => item.id === id ? {...item, qty} : item);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cart.reduce((acc, item) => acc + item.prix * item.qty, 0);

  const goToCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) return <p>Votre panier est vide</p>;

  return (
    <div className="cart-page">
      <h1>Mon Panier</h1>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.nom} />
            <div className="item-info">
              <h3>{item.nom}</h3>
              <p>{item.prix} €</p>
              <input
                type="number"
                min="1"
                value={item.qty}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
              />
              <button onClick={() => removeItem(item.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
      <h2>Total : {total} €</h2>
      <button onClick={goToCheckout}>Passer la commande</button>
    </div>
  );
};

export default CartPage;
