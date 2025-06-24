import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import './News.css'; // <-- Utiliser directement le CSS des actualités
import './Realisation.css'; // Garder pour le style des cartes
import './Atouts.css'; // Importer les styles pour les titres
import './LatestRealisations.css'; // J'ajoute un fichier CSS dédié pour le style horizontal

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

function RealisationCardHorizontal({ item, onReadMore }) {
  // Image à gauche, texte à droite, bande verticale à gauche de l'image
  return (
    <div className="realisation-horizontal-card">
      <div className="realisation-horizontal-img-wrap">
        {(item.country || item.year) && (
          <div className="realisation-horizontal-label-vertical left">
            {item.country && <span className="label-country">{item.country}</span>}
            {item.year && <span className="label-year">{item.year}</span>}
          </div>
        )}
        <img src={item.images && item.images.length > 0 ? item.images[0] : item.image} alt={item.title} className="realisation-horizontal-img" />
      </div>
      <div className="realisation-horizontal-text">
        <button className="realisation-horizontal-title-btn" onClick={() => onReadMore(item)}>
          <h3 className="realisation-horizontal-title">{item.title}</h3>
        </button>
        <p className="realisation-horizontal-desc">{item.description}</p>
      </div>
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
    <div className="news-section">
      <div className="news-header">
        <h2 className="news-title">Nos Dernières Réalisations</h2>
        <p className="news-subtitle">Découvrez un aperçu de nos projets les plus récents.</p>
      </div>
      <div className="realisation-horizontal-list">
        {realisations.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.12 }}
          >
            <RealisationCardHorizontal item={item} onReadMore={handleReadMore} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default LatestRealisations; 