import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '../supabaseClient';
import { motion, useInView } from 'framer-motion';
import './Realisation.css';

const ITEMS_PER_PAGE = 6;

// Composant pour le chargement paresseux d'une vidéo miniature
function LazyThumbnail({ url }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "200px" });

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#222', borderRadius: '12px', overflow: 'hidden' }} ref={ref}>
      {isInView && (
        <video
          src={url}
          className="realisation-image-pro pro-list-img"
          preload="metadata"
          muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
        />
      )}
      <span className="pro-list-play-icon">▶</span>
    </div>
  );
}

function Realisation() {
  const [realisations, setRealisations] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRealisations = async () => {
      const { data, error } = await supabase
        .from('realisations')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setRealisations(data || []);
    };
    fetchRealisations();
  }, []);

  // Reset page on search
  useEffect(() => { setPage(1); }, [search]);

  const handleReadMore = (item) => {
    navigate(`/realisation/${item.id}`);
  };

  const filtered = realisations.filter(item =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="realisation-section-container">
      <Helmet>
        <title>Réalisations | SERVAGRI — Projets d'irrigation au Sénégal</title>
        <meta name="description" content="Explorez les réalisations de SERVAGRI : installations d'irrigation, projets agricoles innovants et solutions de précision déployées à travers tout le Sénégal." />
      </Helmet>
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
          <h1>Nos Réalisations</h1>
          <p>De la conception à la mise en œuvre, découvrez comment nous transformons les défis agricoles en succès.</p>
        </div>
      </section>

      {/* Barre de recherche */}
      <section className="realisation-section">
        <div style={{ maxWidth: 500, margin: '0 auto 2rem auto' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Rechercher une réalisation..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="news-search-input"
              style={{ width: '100%', paddingLeft: '2.8rem' }}
            />
            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
              width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          {search && (
            <p style={{ fontSize: '0.88rem', color: '#6b7280', margin: '0.5rem 0 0 0.5rem' }}>
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''} pour "{search}"
            </p>
          )}
        </div>

        <div className="realisation-grid">
          {paginated.map((item) => (
            <article className="realisation-card-pro pro-list-card" key={item.id}>
              <div className="realisation-image-container-pro pro-list-thumb">
                {item.medias && item.medias.length > 0 ? (
                  <div className="realisation-media-gallery">
                    {item.medias[0].type === 'image' ? (
                      <img
                        src={item.medias[0].url}
                        alt={item.title}
                        className="realisation-image-pro pro-list-img"
                        style={{aspectRatio:'16/9',objectFit:'cover'}}
                      />
                    ) : (
                      <LazyThumbnail url={item.medias[0].url} />
                    )}
                    {item.medias.length > 1 && (
                      <div className="media-count-badge pro-list-badge">+{item.medias.length - 1}</div>
                    )}
                  </div>
                ) : (
                  <div className="realisation-image-placeholder pro-list-placeholder">
                    <span>Aucun média</span>
                  </div>
                )}
              </div>
              <div className="realisation-content-pro">
                <h3 className="realisation-card-title-pro">{item.title}</h3>
                <p className="realisation-excerpt-pro">{item.description}</p>
                <button className="realisation-read-more-pro" onClick={() => handleReadMore(item)}>
                  Voir le projet
                </button>
              </div>
            </article>
          ))}
          {paginated.length === 0 && (
            <div style={{textAlign:'center',color:'#888',width:'100%',marginTop:'2rem',fontSize:'1.1rem'}}>
              Aucune réalisation trouvée.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '0.5rem 1.2rem', borderRadius: 8, border: '1.5px solid #c8e6c9',
                background: page === 1 ? '#f9f9f9' : '#fff', color: '#2e7d32', fontWeight: 600,
                cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1,
              }}
            >← Préc.</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: 8,
                  border: page === i + 1 ? '2px solid #2e7d32' : '1.5px solid #c8e6c9',
                  background: page === i + 1 ? '#2e7d32' : '#fff',
                  color: page === i + 1 ? '#fff' : '#2e7d32',
                  fontWeight: 700, cursor: 'pointer',
                }}
              >{i + 1}</button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '0.5rem 1.2rem', borderRadius: 8, border: '1.5px solid #c8e6c9',
                background: page === totalPages ? '#f9f9f9' : '#fff', color: '#2e7d32', fontWeight: 600,
                cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1,
              }}
            >Suiv. →</button>
          </div>
        )}
        {filtered.length > 0 && (
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem', marginTop: '1rem' }}>
            Page {page} sur {totalPages} — {filtered.length} réalisation{filtered.length > 1 ? 's' : ''}
          </p>
        )}
      </section>
    </div>
  );
}

export default Realisation;
 