import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiCalendar, FiUser } from 'react-icons/fi';
import { supabase } from '../../services/supabase';
import './NewsSection.css';

function NewsSection() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(9); // Limit to 9 for carrousel
      
      if (!error) setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  const itemsPerPage = 3;
  const maxPage = Math.max(0, Math.ceil(news.length / itemsPerPage) - 1);
  const pagedNews = news.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(maxPage, p + 1));

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) return null; // Or skeleton

  return (
    <section className="news-section-pro">
      <div className="news-container-pro">
        <div className="news-header-pro">
          <motion.span 
            className="news-badge-pro"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Actualités
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Le Mag Servagri
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Découvrez nos dernières avancées, les conseils de nos experts et l'actualité de l'agriculture de précision au Sénégal.
          </motion.p>
        </div>

        <div className="news-carousel-wrapper-pro">
          <button 
            className="news-nav-btn-pro" 
            onClick={handlePrev} 
            disabled={page === 0}
            aria-label="Précédent"
          >
            <FiArrowLeft size={24} />
          </button>

          <div className="news-grid-pro">
            <AnimatePresence mode="wait">
              {pagedNews.map((item, idx) => (
                <motion.article 
                  className="news-card-pro" 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <div className="news-img-container-pro">
                    <img 
                      src={item.image_url || item.image || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop'} 
                      alt={item.title} 
                      className="news-img-pro" 
                      loading="lazy"
                    />
                    <div className="news-meta-pro">
                      <span className="news-cat-badge-pro">{item.category || 'Actualité'}</span>
                    </div>
                  </div>
                  <div className="news-body-pro">
                    <div className="news-date-pro">
                      <FiCalendar size={14} />
                      {formatDate(item.created_at || item.date)}
                    </div>
                    <h3 className="news-title-pro">{item.title}</h3>
                    <div className="news-excerpt-pro" dangerouslySetInnerHTML={{ __html: item.excerpt || item.content?.slice(0, 150) + '...' }} />
                    <div className="news-footer-pro">
                      <div className="news-author-pro">
                        <img 
                          src={`https://ui-avatars.com/api/?name=Servagri&background=207c2f&color=fff`}
                          alt="Servagri"
                          className="news-author-img-pro"
                        />
                        <span className="news-author-name-pro">Équipe Servagri</span>
                      </div>
                      <button 
                        className="news-link-pro"
                        onClick={() => navigate(`/actualites/${item.id}`)}
                      >
                        Lire <FiArrowRight />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          <button 
            className="news-nav-btn-pro" 
            onClick={handleNext} 
            disabled={page === maxPage}
            aria-label="Suivant"
          >
            <FiArrowRight size={24} />
          </button>
        </div>

        {maxPage > 0 && (
          <div className="news-view-indicator-pro">
            {Array.from({ length: maxPage + 1 }).map((_, idx) => (
              <span
                key={idx}
                className={`news-dot-pro ${idx === page ? 'active' : ''}`}
                onClick={() => setPage(idx)}
              />
            ))}
          </div>
        )}

        <motion.div 
          className="news-view-all-container-pro"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link to="/actualites" className="news-view-all-btn-pro">
            Voir toutes les actualités <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default NewsSection;
 