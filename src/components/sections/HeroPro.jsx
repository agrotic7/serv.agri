import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabase';
import './HeroPro.css';
import { FaArrowRight } from 'react-icons/fa';

function HeroPro() {
  const videoRef = useRef(null);
  const [heroData, setHeroData] = useState({
    title: "L'agriculture de précision, du champ à votre écran",
    subtitle: "Boostez vos récoltes et économisez l'eau grâce à nos solutions connectées et intelligentes.",
    videoUrl: "/Vidéo_Irrigation_Automatique_Prête.mp4"
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();
      
      if (data && !error) {
        setHeroData({
          title: data.hero_title || heroData.title,
          subtitle: data.hero_subtitle || heroData.subtitle,
          videoUrl: data.hero_video_url || heroData.videoUrl
        });
      }
    };
    fetchHeroData();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Erreur de lecture automatique de la vidéo:", error);
      });
    }
  }, [heroData.videoUrl]);
  
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
          key={heroData.videoUrl}
          className="realisation-hero-video"
          src={heroData.videoUrl}
          poster="/Poster.png"
          autoPlay
          loop
          muted
          playsInline
          ref={videoRef}
        />
        <div className="realisation-hero-content hero-pro-content">
          <motion.h1
            className="hero-pro-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            dangerouslySetInnerHTML={{ __html: heroData.title }}
          />
          <motion.p
            className="hero-pro-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          >
            {heroData.subtitle}
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