import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './News.css';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

function News() {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setNews(data);
    };
    fetchNews();
  }, []);

  const handleReadMore = (item) => {
    // Naviguer vers la page de détail avec l'ID de l'actualité
    navigate(`/actualites/${item.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <section className="news-section">
        <div className="news-header">
          <h2 className="news-title">Actualités</h2>
          <p className="news-subtitle">Restez informé des dernières nouvelles de SERVAGRI</p>
        </div>
        <div className="news-grid">
          {news.map((item) => (
            <article className="news-card" key={item.id}>
              <div className="news-image-container">
                <img src={item.image_url} alt={item.title} className="news-image" />
              </div>
              <div className="news-content">
                <span className="news-date">{item.date}</span>
                <h3 className="news-card-title">{item.title}</h3>
                <p className="news-excerpt">{item.excerpt}</p>
                <button 
                  className="news-read-more"
                  onClick={() => handleReadMore(item)}
                >
                  Lire la suite
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default News; 