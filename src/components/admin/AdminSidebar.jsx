import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiSettings, FiGrid, FiFileText, FiBriefcase, FiZap, FiUsers, FiMail, FiMessageSquare } from 'react-icons/fi';
import './AdminSidebar.css';

const links = [
  {
    to: '/admin',
    label: 'Tableau de bord',
    icon: <FiGrid />
  },
  {
    to: '/admin/news',
    label: 'Actualités',
    icon: <FiFileText />
  },
  {
    to: '/admin/realisations',
    label: 'Réalisations',
    icon: <FiBriefcase />
  },
  {
    to: '/admin/solutions',
    label: 'Solutions',
    icon: <FiZap />
  },
  {
    to: '/admin/partners',
    label: 'Partenaires',
    icon: <FiUsers />
  },
  {
    to: '/admin/newsletters',
    label: 'Newsletters',
    icon: <FiMail />
  },
  {
    to: '/admin/contacts',
    label: 'Messages',
    icon: <FiMessageSquare />
  },
  {
    to: '/admin/settings',
    label: 'Paramètres',
    icon: <FiSettings />
  }
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    }
  };
  return (
    <aside className="admin-sidebar glass-effect">
      <div className="sidebar-logo">
        <img src="/servagri_logo.png" alt="Logo Servagri" />
        <span className="sidebar-title">ADMIN</span>
      </div>
      <nav className="sidebar-links">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
            end={link.to === '/admin'}
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span className="sidebar-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="sidebar-logout" onClick={handleLogout}>
        <span className="sidebar-icon">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-10H5c-1.1 0-2 .9-2 2v6h2V5h14v14H5v-4H3v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="#dc2626"/></svg>
        </span>
        <span className="sidebar-label">Déconnexion</span>
      </button>
    </aside>
  );
} 