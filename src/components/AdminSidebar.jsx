import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

const links = [
  {
    to: '/admin',
    label: 'Tableau de bord',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="#4bbf73"/></svg>
    )
  },
  {
    to: '/admin/news',
    label: 'Actualités',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-3c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#4bbf73"/></svg>
    )
  },
  {
    to: '/admin/realisations',
    label: 'Réalisations',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zm0 2h8v10H4V5h8v4zm-2 4h4v2h-4v-2z" fill="#4bbf73"/></svg>
    )
  },
  {
    to: '/admin/solutions',
    label: 'Solutions',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#4bbf73"/></svg>
    )
  },
  {
    to: '/admin/partners',
    label: 'Partenaires',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 2.08 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="#4bbf73"/></svg>
    )
  },
  {
    to: '/admin/newsletters',
    label: 'Newsletters',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#4bbf73"/></svg>
    )
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