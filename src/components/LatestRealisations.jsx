import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import './News.css'; // <-- Utiliser directement le CSS des actualités
import './Realisation.css'; // Garder pour le style des cartes
import './Atouts.css'; // Importer les styles pour les titres

function LatestRealisations() {
  const [realisations, setRealisations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestRealisations = async () => {
      const { data, error } = await supabase
        .from('realisations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) {
        console.error("Erreur lors de la récupération des réalisations:", error);
      } else {
        setRealisations(data);
      }
    };
    fetchLatestRealisations();
  }, []);

  const handleReadMore = (item) => {
    navigate(`/realisation/${item.id}`);
  };

  return (
    <div className="news-section"> {/* <-- Utiliser la classe de la section actualités */}
      <div className="news-header"> {/* <-- Utiliser la classe du header actualités */}
        <h2 className="news-title">Nos Dernières Réalisations</h2>
        <p className="news-subtitle">Découvrez un aperçu de nos projets les plus récents.</p>
      </div>
      <div className="realisation-grid">
        {realisations.map((item, idx) => (
          <motion.article
            className="realisation-card"
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <div className="realisation-image-container">
              <img 
                src={item.image} 
                alt={item.title} 
                className="realisation-image" 
              />
            </div>
            <div className="realisation-content">
              <h3 className="realisation-card-title">{item.title}</h3>
              <p className="realisation-excerpt">{item.description}</p>
              <button 
                className="realisation-read-more"
                onClick={() => handleReadMore(item)}
              >
                Voir le projet
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export default LatestRealisations; 