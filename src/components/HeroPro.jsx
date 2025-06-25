import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './HeroPro.css'; // Importation du fichier CSS

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
        <div className="realisation-hero-content">
          <h1>L'agriculture de précision, du champ à votre écran.</h1>
          <p>Optimisez votre rendement et économisez l'eau grâce à nos solutions d'irrigation intelligentes et connectées.</p>
          <a href="#atouts" onClick={scrollToContent} className="cta-hero">
            Découvrir nos solutions
          </a>
        </div>
      </section>
    </div>
  );
}

export default HeroPro;