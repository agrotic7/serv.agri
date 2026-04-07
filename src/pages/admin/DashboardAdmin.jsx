import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import './Admin.css';
import { motion } from 'framer-motion';
import { FiActivity, FiFileText, FiBriefcase, FiMail, FiMessageSquare, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function DashboardAdmin() {
  const [newsCount, setNewsCount] = useState(0);
  const [realisationsCount, setRealisationsCount] = useState(0);
  const [newsletterCount, setNewsletterCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [{ count: news }, { count: real }, { count: nl }, { count: msg }] = await Promise.all([
          supabase.from('news').select('*', { count: 'exact', head: true }),
          supabase.from('realisations').select('*', { count: 'exact', head: true }),
          supabase.from('newsletter').select('*', { count: 'exact', head: true }),
          supabase.from('contacts').select('*', { count: 'exact', head: true }).catch(() => ({ count: 0 })),
        ]);
        setNewsCount(news || 0);
        setRealisationsCount(real || 0);
        setNewsletterCount(nl || 0);
        setMessagesCount(msg || 0);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Actualités', value: newsCount, icon: <FiFileText />, color: '#4bbf73', to: '/admin/news' },
    { label: 'Réalisations', value: realisationsCount, icon: <FiBriefcase />, color: '#3b82f6', to: '/admin/realisations' },
    { label: 'Newsletter', value: newsletterCount, icon: <FiMail />, color: '#f59e0b', to: '/admin/newsletters' },
    { label: 'Messages', value: messagesCount, icon: <FiMessageSquare />, color: '#ef4444', to: '/admin/contacts' },
  ];

  return (
    <motion.div
      className="dashboard-admin-pro"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="admin-page-header compact">
        <div className="admin-welcome-wrap">
          <div className="admin-avatar">
            <img src={`https://ui-avatars.com/api/?name=Admin+Servagri&background=207c2f&color=fff&size=128`} alt="Admin" />
          </div>
          <div>
            <h2>Tableau de bord</h2>
            <p className="admin-page-desc">Bienvenue ! Voici un aperçu de l'activité de votre plateforme.</p>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/admin/settings" className="header-settings-btn"><FiActivity /> Paramètres</Link>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{loading ? '...' : stat.value}</span>
            </div>
            <div className="stat-trend">
              <FiTrendingUp /> +12%
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-layout-pro">
        <div className="dashboard-main-col">
          <div className="content-card">
            <h3>Évolution des contenus</h3>
            <div className="chart-placeholder">
              <svg width="100%" height="200" viewBox="0 0 400 200" preserveAspectRatio="none">
                <path d="M0,150 Q50,130 100,140 T200,80 T300,110 T400,50" fill="none" stroke="#207c2f" strokeWidth="3" />
                <path d="M0,150 Q50,130 100,140 T200,80 T300,110 T400,50 V200 H0 Z" fill="rgba(32, 124, 47, 0.1)" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="dashboard-side-col">
          <div className="content-card">
            <h3>Actions Rapides</h3>
            <div className="quick-actions-list">
              <Link to="/admin/news" className="quick-action-item">
                <FiFileText /> Ajouter une actualité <FiArrowRight />
              </Link>
              <Link to="/admin/realisations" className="quick-action-item">
                <FiBriefcase /> Ajouter une réalisation <FiArrowRight />
              </Link>
              <Link to="/admin/contacts" className="quick-action-item">
                <FiMessageSquare /> Gérer les messages <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-page-header.compact {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .admin-welcome-wrap {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .admin-avatar img {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .header-settings-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          color: #475569;
          text-decoration: none;
          font-weight: 500;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }
        .header-settings-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: #fff;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .stat-content {
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }
        .stat-trend {
          position: absolute;
          bottom: 12px;
          right: 12px;
          font-size: 0.75rem;
          color: #10b981;
          display: flex;
          align-items: center;
          gap: 4px;
          background: #ecfdf5;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .dashboard-layout-pro {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }
        .content-card {
          background: #fff;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
        }
        .content-card h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
        }
        .quick-actions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .quick-action-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 10px;
          color: #475569;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
        }
        .quick-action-item svg:last-child {
          margin-left: auto;
          opacity: 0.5;
        }
        .quick-action-item:hover {
          background: #f1f5f9;
          color: #207c2f;
          transform: translateX(4px);
        }
        @media (max-width: 1024px) {
          .dashboard-layout-pro { grid-template-columns: 1fr; }
        }
      `}</style>
    </motion.div>
  );
}