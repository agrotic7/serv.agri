import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Testimonials.css';

const testimonials = [
  {
    name: 'Awa Diallo',
    role: 'Agriculteuse, Thiès',
    avatar: 'https://ui-avatars.com/api/?name=Awa+Diallo&background=0f172a&color=fff&size=80',
    quote: "L'intégration des systèmes SERVAGRI a optimisé notre consommation hydrique de 35% tout en améliorant significativement les rendements de l'exploitation.",
    stars: 5,
    project: 'Infrastructure d\'irrigation – 5 hectares',
  },
  {
    name: 'Moussa Konaté',
    role: "Directeur, Coopérative de Saint-Louis",
    avatar: 'https://ui-avatars.com/api/?name=Moussa+Konate&background=1e293b&color=fff&size=80',
    quote: "Leur expertise technique et l'accompagnement continu ont permis à notre coopérative de faire une transition vers l'agriculture connectée de manière fluide.",
    stars: 5,
    project: 'Analyse de données agronomiques',
  },
  {
    name: 'Fatou Sarr',
    role: 'Exploitante maraîchère, Casamance',
    avatar: 'https://ui-avatars.com/api/?name=Fatou+Sarr&background=334155&color=fff&size=80',
    quote: "Les tableaux de bord analytiques nous procurent une visibilité en temps réel indispensable pour une prise de décision rapide et efficace.",
    stars: 5,
    project: "Agriculture de précision",
  },
  {
    name: 'Ibrahim Ndiaye',
    role: 'Gérant d\'exploitation, Kaolack',
    avatar: 'https://ui-avatars.com/api/?name=Ibrahim+Ndiaye&background=475569&color=fff&size=80',
    quote: "La formation dispensée par les ingénieurs de SERVAGRI a permis à nos équipes opérationnelles d'atteindre une autonomie complète sur les nouvelles installations.",
    stars: 5,
    project: 'Formation technique',
  },
];

function StarRating({ stars }) {
  return (
    <div className="testimonial-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar key={i} className={i <= stars ? 'star filled' : 'star'} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const goTo = (idx) => { setCurrent(idx); setPaused(true); setTimeout(() => setPaused(false), 8000); };

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2 className="testimonials-title">Ils nous font confiance</h2>
        <p className="testimonials-subtitle">Des agriculteurs sénégalais témoignent de leur expérience avec SERVAGRI</p>
      </div>
      <div className="testimonials-carousel-wrap">
        <button className="testimonials-arrow left" onClick={() => goTo((current - 1 + testimonials.length) % testimonials.length)} aria-label="Précédent">
          <FiChevronLeft />
        </button>
        <div className="testimonials-track">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="testimonial-card-main"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="testimonial-content-wrapper">
                <StarRating stars={testimonials[current].stars} />
                <p className="testimonial-quote">"{testimonials[current].quote}"</p>
                <div className="testimonial-author">
                  <img src={testimonials[current].avatar} alt={testimonials[current].name} className="testimonial-avatar" />
                  <div>
                    <div className="testimonial-name">{testimonials[current].name}</div>
                    <div className="testimonial-role">{testimonials[current].role}</div>
                    <div className="testimonial-project">{testimonials[current].project}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <button className="testimonials-arrow right" onClick={() => goTo((current + 1) % testimonials.length)} aria-label="Suivant">
          <FiChevronRight />
        </button>
      </div>
      <div className="testimonials-dots">
        {testimonials.map((_, idx) => (
          <button key={idx} className={`testimonials-dot${idx === current ? ' active' : ''}`} onClick={() => goTo(idx)} aria-label={`Témoignage ${idx + 1}`} />
        ))}
      </div>
    </section>
  );
}
