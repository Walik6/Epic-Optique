import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import Footer from './components/Footer';
import ProduitsPage from './pages/ProduitsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardAdmin from './pages/DashboardAdmin';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Page d'accueil */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <CategorySection />
            </>
          }
        />

        {/* Page produits par catégorie */}
        <Route path="/produits/:categorie" element={<ProduitsPage />} />

        {/* Panier */}
        <Route path="/cart" element={<CartPage />} />

        {/* Checkout / validation de commande */}
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Dashboard admin */}
        <Route path="/admin" element={<DashboardAdmin />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
