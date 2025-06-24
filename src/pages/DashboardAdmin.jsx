import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';
import { motion } from 'framer-motion';

export default function DashboardAdmin() {
  const [newsCount, setNewsCount] = useState(0);
  const [realisationsCount, setRealisationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const { count: news } = await supabase.from('news').select('*', { count: 'exact', head: true });
      const { count: real } = await supabase.from('realisations').select('*', { count: 'exact', head: true });
      setNewsCount(news || 0);
      setRealisationsCount(real || 0);
      setLoading(false);
    };
    fetchStats();
  }, []);

  // Données fictives pour le graphique (6 derniers mois)
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
  const newsData = [2, 4, 3, 6, 5, newsCount];
  const realData = [1, 2, 2, 3, 2, realisationsCount];

  return (
    <motion.div
      className="dashboard-admin"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="admin-page-header dashboard">
        <span className="admin-page-icon">
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="#4bbf73"/></svg>
        </span>
        <div className="admin-avatar">
          <img src="https://ui-avatars.com/api/?name=Admin+Servagri&background=4bbf73&color=fff&size=64" alt="Admin" />
        </div>
        <div>
          <h2>Bienvenue sur le tableau de bord</h2>
          <p className="admin-page-desc">Vue d'ensemble de votre plateforme SERVAGRI.</p>
        </div>
      </div>
      <div className="dashboard-welcome">
        <p>Gérez vos actualités, réalisations et suivez l'activité de votre plateforme SERVAGRI.</p>
      </div>
      <div className="dashboard-stats">
        <div className="dashboard-card">
          <span className="dashboard-card-title">Actualités</span>
          <span className="dashboard-card-value">{loading ? '...' : newsCount}</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-title">Réalisations</span>
          <span className="dashboard-card-value">{loading ? '...' : realisationsCount}</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-title">Visiteurs</span>
          <span className="dashboard-card-value">1 245</span>
        </div>
      </div>
      <div className="dashboard-actions">
        <a href="/admin/news" className="dashboard-action-btn">+ Ajouter une actualité</a>
        <a href="/admin/realisations" className="dashboard-action-btn">+ Ajouter une réalisation</a>
      </div>
      <div className="dashboard-graph-section">
        <h3>Évolution des contenus (6 derniers mois)</h3>
        <div className="dashboard-graph">
          <svg width="100%" height="180" viewBox="0 0 340 180">
            {/* Axes */}
            <polyline points="40,10 40,160 320,160" fill="none" stroke="#bbb" strokeWidth="2" />
            {/* Courbe actualités */}
            <polyline
              fill="none"
              stroke="#4bbf73"
              strokeWidth="3"
              points={newsData.map((v, i) => `${40 + i*56},${160 - v*20}`).join(' ')}
            />
            {/* Courbe réalisations */}
            <polyline
              fill="none"
              stroke="#e6c77a"
              strokeWidth="3"
              points={realData.map((v, i) => `${40 + i*56},${160 - v*20}`).join(' ')}
            />
            {/* Points */}
            {newsData.map((v, i) => (
              <circle key={i} cx={40 + i*56} cy={160 - v*20} r="4" fill="#4bbf73" />
            ))}
            {realData.map((v, i) => (
              <circle key={i+10} cx={40 + i*56} cy={160 - v*20} r="4" fill="#e6c77a" />
            ))}
            {/* Labels mois */}
            {months.map((m, i) => (
              <text key={m} x={40 + i*56} y={175} textAnchor="middle" fontSize="13" fill="#888">{m}</text>
            ))}
            {/* Légende */}
            <rect x="220" y="20" width="16" height="8" fill="#4bbf73" />
            <text x="240" y="28" fontSize="13" fill="#4bbf73">Actualités</text>
            <rect x="220" y="38" width="16" height="8" fill="#e6c77a" />
            <text x="240" y="46" fontSize="13" fill="#e6c77a">Réalisations</text>
          </svg>
        </div>
      </div>
    </motion.div>
  );
} 