import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './News.css';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import './Realisation.css';

function News() {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");

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

  // Récupérer dynamiquement les catégories présentes
  const categories = [
    "Toutes",
    ...Array.from(new Set(news.map(item => item.category).filter(Boolean)))
  ];

  // Filtrage combiné
  const filteredNews = news.filter(item => {
    const matchCategory = selectedCategory === "Toutes" || item.category === selectedCategory;
    const matchSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.content?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="realisation-section-container">
        <section className="realisation-hero">
          <video
            className="realisation-hero-video"
            src="/Vidéo_Irrigation_Automatique_Prête.mp4"
            poster="/Poster.png"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="realisation-hero-content">
            <h1>Nos Actualités</h1>
            <p>L'innovation au service de l'agriculture durable.<br/>Découvrez nos dernières avancées et l'actualité du secteur.</p>
            <button
              className="cta-hero"
              onClick={() => {
                const newsSection = document.querySelector('.news-section');
                if (newsSection) {
                  window.scrollTo({
                    top: newsSection.offsetTop,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              Voir les actualités
            </button>
          </div>
        </section>
        <section className="news-section" style={{paddingTop: '3rem'}}>
          <div className="news-header" style={{marginBottom: '2rem'}}>
            <div className="news-filters-bar" style={{gap: '0.5rem', flexWrap: 'nowrap'}}>
              <input
                type="text"
                className="news-search-input"
                placeholder="Rechercher une actualité..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{marginRight: '0.5rem', flex: '1 1 220px', minWidth: 0}}
              />
              <div className="news-categories" style={{gap: '0.2rem', flexWrap: 'nowrap'}}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={
                      "news-category-btn" + (selectedCategory === cat ? " active" : "")
                    }
                    onClick={() => setSelectedCategory(cat)}
                    style={{margin: 0}}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="news-grid">
            {filteredNews.map((item, idx) => (
              <article className="realisation-card-pro" key={item.id}>
                <div className="realisation-image-container-pro">
                  {/* Pas d'icône ni de badge pour l'actualité, mais tu peux en ajouter ici si besoin */}
                  <img src={item.image_url} alt={item.title} className="realisation-image-pro" />
                </div>
                <div className="realisation-content-pro">
                  <h3 className="realisation-card-title-pro">{item.title}</h3>
                  <div className="realisation-excerpt-pro" dangerouslySetInnerHTML={{ __html: item.content }} />
                  <button 
                    className="realisation-read-more-pro"
                    onClick={() => handleReadMore(item)}
                  >
                    Lire la suite
                  </button>
                </div>
              </article>
            ))}
            {filteredNews.length === 0 && (
              <div style={{textAlign:'center', color:'#888', width:'100%', marginTop:'2rem', fontSize:'1.1rem'}}>Aucune actualité trouvée.</div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

export default News; 