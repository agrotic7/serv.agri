import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './News.css';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabase';
import '../realisations/Realisation.css';

function News() {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

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

  // Reset page on filter/search change
  useEffect(() => { setPage(1); }, [search, selectedCategory]);

  // Filtrage combiné
  const filteredNews = news.filter(item => {
    const matchCategory = selectedCategory === "Toutes" || item.category === selectedCategory;
    const matchSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.content?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const pagedNews = filteredNews.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Actualités | SERVAGRI — Agriculture de Précision</title>
        <meta name="description" content="Restez informé des dernières nouvelles de SERVAGRI : innovations, projets, événements et actualités du secteur agricole au Sénégal." />
      </Helmet>
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
            {pagedNews.map((item) => (
              <article className="realisation-card-pro" key={item.id}>
                <div className="realisation-image-container-pro">
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
            {pagedNews.length === 0 && (
              <div style={{textAlign:'center', color:'#888', width:'100%', marginTop:'2rem', fontSize:'1.1rem'}}>Aucune actualité trouvée.</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '0.5rem 1.2rem', borderRadius: 8, border: '1.5px solid #c8e6c9', background: page === 1 ? '#f9f9f9' : '#fff', color: '#2e7d32', fontWeight: 600, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>
                ← Préc.
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  style={{ padding: '0.5rem 1rem', borderRadius: 8, border: page === i + 1 ? '2px solid #2e7d32' : '1.5px solid #c8e6c9', background: page === i + 1 ? '#2e7d32' : '#fff', color: page === i + 1 ? '#fff' : '#2e7d32', fontWeight: 700, cursor: 'pointer' }}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ padding: '0.5rem 1.2rem', borderRadius: 8, border: '1.5px solid #c8e6c9', background: page === totalPages ? '#f9f9f9' : '#fff', color: '#2e7d32', fontWeight: 600, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>
                Suiv. →
              </button>
            </div>
          )}
          {filteredNews.length > 0 && (
            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem', marginTop: '1rem' }}>
              Page {page} sur {totalPages} — {filteredNews.length} actualité{filteredNews.length > 1 ? 's' : ''}
            </p>
          )}
        </section>
      </div>
    </motion.div>
  );
}

export default News; 