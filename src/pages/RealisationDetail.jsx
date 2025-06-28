import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import './RealisationDetail.css';
import { FaPlayCircle, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function RealisationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [realisation, setRealisation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef(null);

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

  const openLightbox = (idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const prevMedia = (e) => {
    e && e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + realisation.medias.length) % realisation.medias.length);
  };
  const nextMedia = (e) => {
    e && e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % realisation.medias.length);
  };
  // Accessibilité : navigation clavier
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevMedia();
      if (e.key === 'ArrowRight') nextMedia();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, realisation]);

  const scrollToIndex = (idx) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const child = container.children[idx];
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };
  const handleCarouselNav = (dir) => {
    let next = carouselIndex + dir;
    if (next < 0) next = realisation.medias.length - 1;
    if (next >= realisation.medias.length) next = 0;
    setCarouselIndex(next);
    scrollToIndex(next);
  };
  useEffect(() => {
    scrollToIndex(carouselIndex);
  }, [carouselIndex, lightboxOpen]);

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

      <article className="realisation-detail pro-detail-card">
        <div className="pro-detail-header pro-detail-header-animated">
          <div className="pro-detail-header-bg"></div>
          <span className="pro-detail-date">{realisation.date && new Date(realisation.date).toLocaleDateString('fr-FR', {year:'numeric', month:'long', day:'numeric'})}</span>
          <h1 className="pro-detail-title">{realisation.title}</h1>
          {realisation.featured && <span className="pro-detail-badge">À la une</span>}
        </div>
        <div className="realisation-detail-images-container pro-detail-gallery-wrap pro-detail-gallery-animated">
          {realisation.medias && realisation.medias.length > 0 ? (
            <div className="pro-carousel-wrap">
              <button className="pro-carousel-arrow left" onClick={() => handleCarouselNav(-1)} aria-label="Précédent">&#8592;</button>
              <div className="pro-carousel" ref={carouselRef} tabIndex={0} aria-label="Galerie des médias" role="listbox">
                {realisation.medias.map((media, index) => (
                  <div
                    key={index}
                    className={`pro-carousel-item pro-detail-thumb${index === carouselIndex ? ' active' : ''}`}
                    tabIndex={0}
                    aria-label={media.type === 'image' ? `Voir l'image ${index + 1}` : `Voir la vidéo ${index + 1}`}
                    onClick={() => openLightbox(index)}
                    onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && openLightbox(index)}
                    style={{cursor:'pointer', position:'relative'}}
                  >
                    <span className="pro-detail-thumb-counter">{index+1}/{realisation.medias.length}</span>
                    {media.type === 'image' ? (
                      <>
                        <img 
                          src={media.url} 
                          alt={`${realisation.title} - Image ${index + 1}`} 
                          className="realisation-detail-image pro-gallery-img pro-detail-img" 
                        />
                        <span className="pro-detail-media-icon" title="Image">🖼️</span>
                      </>
                    ) : (
                      <>
                        <video 
                          src={media.url} 
                          className="realisation-detail-video pro-gallery-video pro-detail-video" 
                          style={{pointerEvents:'none', filter:'brightness(0.7)'}}
                          tabIndex={-1}
                        />
                        <span className="pro-detail-media-icon" title="Vidéo">🎬</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <button className="pro-carousel-arrow right" onClick={() => handleCarouselNav(1)} aria-label="Suivant">&#8594;</button>
            </div>
          ) : (
            <div className="realisation-detail-image-placeholder pro-detail-placeholder">
              <span>Aucun média disponible</span>
            </div>
          )}
          {/* Lightbox modale */}
          {lightboxOpen && realisation.medias && (
            <div className="pro-lightbox-overlay pro-detail-lightbox pro-detail-lightbox-animated" onClick={closeLightbox}>
              <div className="pro-detail-lightbox-bg"></div>
              <button className="pro-lightbox-close pro-detail-lightbox-close-animated" onClick={closeLightbox} aria-label="Fermer la modale"><FaTimes /></button>
              <button className="pro-lightbox-nav left pro-detail-lightbox-nav-animated" onClick={prevMedia} aria-label="Précédent"><FaChevronLeft /></button>
              <div className="pro-lightbox-content pro-detail-lightbox-content" onClick={e => e.stopPropagation()}>
                <div className="pro-detail-lightbox-title-row">
                  <span className="pro-detail-lightbox-title">{realisation.title}</span>
                  <span className="pro-detail-lightbox-type">{realisation.medias[lightboxIndex].type === 'image' ? 'Image' : 'Vidéo'}</span>
                </div>
                {realisation.medias[lightboxIndex].type === 'image' ? (
                  <img
                    src={realisation.medias[lightboxIndex].url}
                    alt={`${realisation.title} - Image ${lightboxIndex + 1}`}
                    className="pro-lightbox-img pro-detail-lightbox-img"
                  />
                ) : (
                  <video
                    src={realisation.medias[lightboxIndex].url}
                    controls
                    autoPlay
                    className="pro-lightbox-video pro-detail-lightbox-video"
                  />
                )}
                <div className="pro-lightbox-counter pro-detail-lightbox-counter">{lightboxIndex + 1} / {realisation.medias.length}</div>
              </div>
              <button className="pro-lightbox-nav right pro-detail-lightbox-nav-animated" onClick={nextMedia} aria-label="Suivant"><FaChevronRight /></button>
            </div>
          )}
        </div>
        <div className="realisation-detail-content pro-detail-content pro-detail-content-animated">
          <div className="realisation-detail-excerpt pro-detail-excerpt">{realisation.description}</div>
          <hr className="pro-detail-separator" />
          <div className="realisation-detail-full-content pro-detail-full-content">
            {realisation.fullContent}
          </div>
        </div>
      </article>
    </motion.div>
  );
}

export default RealisationDetail; 