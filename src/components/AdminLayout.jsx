import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaTachometerAlt, FaBoxOpen, FaClipboardList, FaChartLine, FaCashRegister, FaSignOutAlt } from 'react-icons/fa';
import './AdminLayout.css';
import logo from '../assets/LogoNoir.jpg';

const NAV_ITEMS = [
  { to: '/overview', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/stock', label: 'Stock', icon: FaBoxOpen },
  { to: '/admin', label: 'Commandes', icon: FaClipboardList },
  { to: '/ventes', label: 'Ventes', icon: FaChartLine },
  { to: '/caisse', label: 'Caisse', icon: FaCashRegister },
];

const AdminLayout = ({ children, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  const SidebarContent = (
    <>
      <div className="admin-sidebar-header">
        <img src={logo} alt="Epic Optique" className="admin-sidebar-logo" />
        <span>Epic Optique</span>
      </div>

      <nav className="admin-sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={closeDrawer}
            className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button className="admin-nav-logout" onClick={onLogout}>
        <FaSignOutAlt size={16} />
        Déconnexion
      </button>
    </>
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        {SidebarContent}
      </aside>

      <div className="admin-topbar">
        <button className="admin-hamburger" onClick={() => setDrawerOpen(true)} aria-label="Ouvrir le menu">
          <FaBars size={20} />
        </button>
        <span className="admin-topbar-title">Epic Optique Admin</span>
      </div>

      {drawerOpen && (
        <div className="admin-drawer-overlay" onClick={closeDrawer}>
          <aside className="admin-drawer" onClick={(e) => e.stopPropagation()}>
            <button className="admin-drawer-close" onClick={closeDrawer} aria-label="Fermer le menu">
              <FaTimes size={20} />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
