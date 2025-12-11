import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import Footer from './components/Footer';
import ProduitsPage from './pages/ProduitsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <CategorySection />
            </>
          }
        />
        <Route path="/produits/:categorie" element={<ProduitsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
