import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Realisation.css';

function NewsSection() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(0); // page courante du carrousel
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

  // Pagination/carrousel : 2 actualités par page
  const itemsPerPage = 2;
  const maxPage = Math.max(0, Math.ceil(news.length / itemsPerPage) - 1);
  const pagedNews = news.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(maxPage, p + 1));

  return (
    <section className="news-section news-carousel-section-pro">
      <div className="news-header">
        <h2 className="news-title">Nos Actualités</h2>
        <p className="news-subtitle">Restez informé des dernières nouvelles de SERVAGRI</p>
      </div>
      <div className="news-carousel-main-pro">
        <button className="news-carousel-arrow-pro left" onClick={handlePrev} disabled={page === 0}>
          &#8592;
        </button>
        <div className="news-grid news-carousel-grid">
          {pagedNews.map((item, idx) => (
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
        </div>
        <button className="news-carousel-arrow-pro right" onClick={handleNext} disabled={page === maxPage}>
          &#8594;
        </button>
      </div>
      <div className="news-carousel-indicators-pro">
        {Array.from({ length: maxPage + 1 }).map((_, idx) => (
          <span
            key={idx}
            className={idx === page ? 'active' : ''}
            onClick={() => setPage(idx)}
          />
        ))}
      </div>
    </section>
  );
}

export default NewsSection; 