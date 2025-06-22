import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NewsDetail.css';
import { supabase } from '../supabaseClient';

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, [id]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!news) {
    return (
      <div className="error-container">
        <h2>Actualité non trouvée</h2>
        <button onClick={() => navigate('/actualites')} className="back-button">
          Retour aux actualités
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
      className="news-detail-container"
    >
      <div className="news-detail-header">
        <button onClick={() => navigate('/actualites')} className="back-button">
          ← Retour aux actualités
        </button>
      </div>

      <article className="news-detail">
        <div className="news-detail-image-container">
          <img src={news.image_url} alt={news.title} className="news-detail-image" />
        </div>

        <div className="news-detail-content">
          <span className="news-detail-date">{news.date}</span>
          <h1 className="news-detail-title">{news.title}</h1>
          <div className="news-detail-excerpt">{news.excerpt}</div>
          <div className="news-detail-full-content">
            {news.content}
          </div>
          {news.category && (
            <div className="news-detail-category">
              <span className="category-label">Catégorie :</span>
              <span className="category-value">{news.category}</span>
            </div>
          )}
        </div>
      </article>
    </motion.div>
  );
}

export default NewsDetail; 