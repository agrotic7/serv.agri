import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import './News.css'; // <-- Utiliser directement le CSS des actualités
import './Realisation.css'; // Garder pour le style des cartes
import './Atouts.css'; // Importer les styles pour les titres

function ImageCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images]);
  if (!images || images.length === 0) return null;
  return (
    <div className="realisation-carousel-pro">
      <img src={images[current]} alt="Projet" className="realisation-image-pro" />
      {images.length > 1 && (
        <div className="carousel-indicators-pro">
          {images.map((_, idx) => (
            <span key={idx} className={current === idx ? 'active' : ''}></span>
          ))}
        </div>
      )}
    </div>
  );
}

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
            className="realisation-card-pro"
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.12 }}
          >
            <div className="realisation-image-container-pro">
              <div className="realisation-icon-pro"><FiAward /></div>
              {idx === 0 && <span className="realisation-badge-nouveau">Nouveau</span>}
              <ImageCarousel images={item.images || (item.image ? [item.image] : [])} />
            </div>
            <div className="realisation-content-pro">
              <h3 className="realisation-card-title-pro">{item.title}</h3>
              <p className="realisation-excerpt-pro">{item.description}</p>
              <button 
                className="realisation-read-more-pro"
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