import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Realisation.css';

function NewsSection() {
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
    navigate(`/actualites/${item.id}`);
  };

  return (
    <section className="news-section">
      <div className="news-header">
        <h2 className="news-title">Nos Actualités</h2>
        <p className="news-subtitle">Restez informé des dernières nouvelles de SERVAGRI</p>
      </div>
      <div className="news-grid">
        {news.map((item, idx) => (
          <article className="realisation-card-pro" key={item.id}>
            <div className="realisation-image-container-pro">
              <img src={item.image_url} alt={item.title} className="realisation-image-pro" />
            </div>
            <div className="realisation-content-pro">
              <h3 className="realisation-card-title-pro">{item.title}</h3>
              <p className="realisation-excerpt-pro">{item.content}</p>
              <button 
                className="realisation-read-more-pro"
                onClick={() => handleReadMore(item)}
              >
                Lire la suite
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NewsSection; 