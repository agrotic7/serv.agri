import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './HeroPro.css'; // Importation du fichier CSS
import { FaArrowRight } from 'react-icons/fa';

function HeroPro() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Erreur de lecture automatique de la vidéo:", error);
      });
    }
  }, []);
  
  const scrollToContent = () => {
    const nextSection = document.querySelector('.atouts-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
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
        <div className="realisation-hero-content hero-pro-content">
          <motion.h1
            className="hero-pro-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            L'agriculture de précision,<br />
            <span className="hero-pro-title-green">du champ à votre écran</span>
          </motion.h1>
          <motion.p
            className="hero-pro-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          >
            Boostez vos récoltes et économisez l'eau grâce à nos solutions connectées et intelligentes.
          </motion.p>
          <motion.a
            href="#atouts"
            onClick={scrollToContent}
            className="hero-pro-btn"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
          >
            Découvrir nos solutions
            <span className="hero-pro-arrow"><FaArrowRight /></span>
          </motion.a>
        </div>
      </section>
    </div>
  );
}

export default HeroPro;