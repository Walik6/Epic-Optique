import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  // Initialiser directement depuis localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sauvegarder le panier dans localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, quantite: p.quantite + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantite: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const increaseQty = (id) => {
    setCart(prev =>
      prev.map(p =>
        p.id === id ? { ...p, quantite: p.quantite + 1 } : p
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(prev =>
      prev
        .map(p =>
          p.id === id ? { ...p, quantite: p.quantite - 1 } : p
        )
        .filter(p => p.quantite > 0)
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, p) => sum + p.quantite, 0);
  const total = cart.reduce((sum, p) => sum + p.prix * p.quantite, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        cartCount,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
};