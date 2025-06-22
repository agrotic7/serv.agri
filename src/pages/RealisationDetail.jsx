import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import './RealisationDetail.css';

function RealisationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [realisation, setRealisation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    // Charger la réalisation depuis Supabase
    const fetchRealisation = async () => {
      let realId = id;
      if (!isNaN(Number(id))) realId = Number(id); // force number si possible
      const { data, error } = await supabase
        .from('realisations')
        .select('*')
        .eq('id', realId)
        .single();
      if (error) {
        setError("Réalisation non trouvée ou erreur de chargement.");
        setRealisation(null);
      } else {
        setRealisation(data);
    }
    setLoading(false);
    };
    fetchRealisation();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div>Chargement de la réalisation...</div>
      </div>
    );
  }

  if (error || !realisation) {
    return (
      <div className="error-container">
        <h2>{error || 'Réalisation non trouvée'}</h2>
        <button onClick={() => navigate('/realisation')} className="back-button">
          Retour aux réalisations
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="realisation-detail-container"
    >
      <div className="realisation-detail-header">
        <button onClick={() => navigate('/realisation')} className="back-button">
          ← Retour aux réalisations
        </button>
      </div>

      <article className="realisation-detail">
        <div className="realisation-detail-images-container">
          {realisation.image && (
            <div className="realisation-detail-image-container">
              <img 
                src={realisation.image} 
                alt={realisation.title} 
                className="realisation-detail-image" 
              />
            </div>
          )}
        </div>

        <div className="realisation-detail-content">
          <span className="realisation-detail-date">{realisation.date}</span>
          <h1 className="realisation-detail-title">{realisation.title}</h1>
          <div className="realisation-detail-excerpt">{realisation.description}</div>
          <div className="realisation-detail-full-content">
            {realisation.fullContent}
          </div>
        </div>
      </article>
    </motion.div>
  );
}

export default RealisationDetail; 