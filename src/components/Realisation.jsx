import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Realisation.css';

function Realisation() {
  const [realisations, setRealisations] = useState([]);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Erreur de lecture automatique de la vidéo:", error);
      });
    }
  }, []);

  useEffect(() => {
    // Charger les réalisations depuis Supabase
    const fetchRealisations = async () => {
      const { data, error } = await supabase
        .from('realisations')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setRealisations(data || []);
    };
    fetchRealisations();
  }, []);

  const handleReadMore = (item) => {
    navigate(`/realisation/${item.id}`);
  };

  return (
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
          <h1>Nos Réalisations</h1>
          <p>De la conception à la mise en œuvre, découvrez comment nous transformons les défis agricoles en succès.</p>
        </div>
      </section>
      <section className="realisation-section">
        <div className="realisation-grid">
          {realisations.map((item, idx) => (
            <article
              className="realisation-card-pro pro-list-card"
              key={item.id}
            >
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
                      <div style={{position:'relative',width:'100%',aspectRatio:'16/9',background:'#222',borderRadius:'12px',overflow:'hidden'}}>
                        <video 
                          src={item.medias[0].url} 
                          alt={item.title} 
                          className="realisation-image-pro pro-list-img"
                          muted
                          loop
                          playsInline
                          style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.7)'}}
                        />
                        <span className="pro-list-play-icon">▶</span>
                      </div>
                    )}
                    {item.medias.length > 1 && (
                      <div className="media-count-badge pro-list-badge">
                        +{item.medias.length - 1}
                      </div>
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
                <button 
                  className="realisation-read-more-pro"
                  onClick={() => handleReadMore(item)}
                >
                  Voir le projet
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Realisation; 