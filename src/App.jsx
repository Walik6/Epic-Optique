import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Header from './components/Header';

import Footer from './components/Footer';
import NotFoundPage from './pages/NotFoundPage';

import Home from './pages/Home';
import ProduitsPage from './pages/ProduitsPage';
import ProduitDetail from './pages/ProduitDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import PromotionsPage from './pages/PromotionsPage';
import NouveautesPage from './pages/NouveautesPage';

import ScrollToTop from './scrollToTop';
import './App.css';

// Chargées à la demande : jamais nécessaires pour un visiteur public,
// inutile d'alourdir le bundle initial avec (recharts en particulier
// est lourd et n'est utilisé que dans DashboardOverview).
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const DashboardAdmin = lazy(() => import('./pages/DashboardAdmin'));
const DashboardOverview = lazy(() => import('./pages/DashboardOverview'));
const Caisse = lazy(() => import('./pages/Caisse'));
const StockPage = lazy(() => import('./pages/StockPage'));
const VentesPage = lazy(() => import('./pages/VentesPage'));
const Login = lazy(() => import('./pages/Login'));

// La sidebar admin ne doit s'afficher que sur ces routes - un admin qui
// navigue vers une page publique doit voir le header/footer normaux.
const ADMIN_PATHS = ['/admin', '/overview', '/stock', '/ventes', '/caisse'];

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //Charger l'utilisateur depuis le localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  //Raccourci clavier Ctrl + B → Login admin
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();

        if (!user || user.role !== 'admin') {
          window.location.href = '/login';
        }
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [user]);

  //Login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  //Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <BrowserRouter>
      <AppShell user={user} loading={loading} handleLogin={handleLogin} handleLogout={handleLogout} />
    </BrowserRouter>
  );
}

function AppShell({ user, loading, handleLogin, handleLogout }) {
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  const showAdminLayout = isAdmin && ADMIN_PATHS.includes(location.pathname);

  //Protection des routes admin
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Chargement...</div>;
    return isAdmin ? children : <Navigate to="/login" />;
  };

  const routesElement = (
    <Routes>
      {/* Page d'accueil */}
      <Route path="/" element={<Home />} />

      {/* Liste de tous les produits */}
      <Route path="/produits" element={<ProduitsPage />} />

      {/* Route 404 */}
      <Route path="*" element={<NotFoundPage />} />

      {/* Détail d'un produit - IMPORTANT: AVANT la route catégorie */}
      <Route path="/produit/:id" element={<ProduitDetail />} />

      {/* Produits par catégorie */}
      <Route path="/produits/categorie/:categorieId" element={<ProduitsPage />} />

      {/* Autres pages */}
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Pages publiques - Promotions et Nouveautés */}
      <Route path="/promotions" element={<PromotionsPage />} />
      <Route path="/nouveautes" element={<NouveautesPage />} />

      {/* Login */}
      <Route
        path="/login"
        element={
          isAdmin
            ? <Navigate to="/admin" />
            : <Login onLogin={handleLogin} />
        }
      />

      {/* Routes admin protégées */}
      <Route
        path="/admin"
        element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>}
      />
      <Route
        path="/overview"
        element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>}
      />
      <Route
        path="/caisse"
        element={<ProtectedRoute><Caisse /></ProtectedRoute>}
      />
      <Route
        path="/stock"
        element={<ProtectedRoute><StockPage /></ProtectedRoute>}
      />
      <Route
        path="/ventes"
        element={<ProtectedRoute><VentesPage /></ProtectedRoute>}
      />
    </Routes>
  );

  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ScrollToTop />

      {showAdminLayout ? (
        <AdminLayout onLogout={handleLogout}>
          {routesElement}
        </AdminLayout>
      ) : (
        <>
          <Header />
          {routesElement}
          <Footer />
        </>
      )}
    </Suspense>
  );
}

export default App;