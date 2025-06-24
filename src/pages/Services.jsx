import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Services.css';
import { FiCheckCircle, FiTrendingUp, FiUsers, FiDroplet, FiBarChart2, FiCpu, FiChevronDown, FiChevronLeft, FiChevronRight, FiHelpCircle, FiClock, FiCloud, FiAward } from 'react-icons/fi';

const heroImg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
const stats = [
  { value: '200+', label: 'Clients satisfaits' },
  { value: '98%', label: 'Taux de satisfaction' },
  { value: '15', label: "Années d'expertise" },
  { value: '40%', label: "Économies d'eau" },
];
const services = [
  {
    icon: <FiDroplet />, badge: "Certifié ISO 9001", badgeClass: "badge-green",
    title: "Systèmes d'irrigation intelligents",
    desc: "Conception et installation de solutions d'irrigation automatisées et connectées, adaptées aux besoins spécifiques de vos cultures pour une utilisation optimale de l'eau.",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    video: "/Systèmes d'irrigation intelligents.mp4"
  },
  {
    icon: <FiBarChart2 />, badge: "IA et apprentissage automatique", badgeClass: "badge-blue",
    title: "Analyse et Big Data Agronomique",
    desc: "Collecte de données via capteurs et drones, analyse avancée et création de tableaux de bord intuitifs pour une prise de décision éclairée.",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
    video: "/Analyse et Big Data Agronomique.mp4"
  },
  {
    icon: <FiTrendingUp />, badge: "Économies Garantis", badgeClass: "badge-orange",
    title: "Optimisation de la Consommation d'Eau",
    desc: "Solutions de précision pour réduire jusqu'à 40% votre consommation d'eau, en tenant compte des prévisions météo et des besoins réels de vos sols.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    video: "/Optimisation de la consonmation d'eau.mp4"
  },
  {
    icon: <FiUsers />, badge: "Assistance 24h/24 et 7j/7", badgeClass: "badge-red",
    title: "Support et Accompagnement Personnalisé",
    desc: "Une équipe d'experts à votre écoute, offrant un support technique réactif et des conseils agronomiques sur mesure, du diagnostic à la maintenance.",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    video: "/Support et Accompagnement Personnalisé.mp4"
  },
  {
    icon: <FiCpu />, badge: "Innovation", badgeClass: "badge-purple",
    title: "Mise en place de l'Agriculture de Précision",
    desc: "Intégration de technologies avancées (drones, capteurs, logiciels) pour une gestion optimisée des parcelles et une productivité accrue.",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    video: "/IA et apprentissage automatique.mp4"
  },
  {
    icon: <FiCheckCircle />, badge: "Compétence", badgeClass: "badge-gold",
    title: "Formations et Ateliers Pratiques",
    desc: "Formations sur l'utilisation de nos systèmes et les meilleures pratiques agronomiques, pour une autonomie complète de vos équipes.",
    img: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
    isNew: true,
    video: "/Formations et Ateliers Pratiques.mp4"
  },
];
const avantages = [
  { icon: <FiCheckCircle />, title: "Expertise terrain", desc: "Une équipe passionnée, proche des agriculteurs." },
  { icon: <FiTrendingUp />, title: "Innovation continue", desc: "Des solutions à la pointe pour une agriculture durable." },
  { icon: <FiUsers />, title: "Accompagnement humain", desc: "Conseil, installation, suivi : on s'occupe de tout !" },
];
const process = [
  { step: 1, title: "Diagnostic", desc: "On analyse vos besoins et votre parcelle." },
  { step: 2, title: "Proposition", desc: "Vous recevez une solution sur-mesure." },
  { step: 3, title: "Installation", desc: "Nos experts installent et paramètrent le système." },
  { step: 4, title: "Suivi & optimisation", desc: "On vous accompagne pour des résultats durables." },
];
const testimonials = [
  { name: "Awa D.", quote: "Grâce à SERVAGRI, j'ai réduit mes coûts et gagné du temps !", img: '/servagri_logo.png' },
  { name: "Moussa K.", quote: "Un accompagnement humain et des outils performants.", img: '/servagri_logo.png' },
];
const partnerIcons = [
  '/servagri_logo.png',
  '/servagri_irrigation.png',
  '/vite.svg',
  '/client1.png',
  '/client2.png',
  '/client3.png',
];
function PartnerCarousel() {
  const [index, setIndex] = useState(0);
  const visible = 3;
  const total = partnerIcons.length;
  const next = () => setIndex((prev) => (prev + 1) % total);
  const prev = () => setIndex((prev) => (prev - 1 + total) % total);
  const getVisible = () => {
    let arr = [];
    for (let i = 0; i < visible; i++) {
      arr.push(partnerIcons[(index + i) % total]);
    }
    return arr;
  };
  return (
    <div className="partner-carousel">
      <button className="carousel-arrow left" onClick={prev} aria-label="Précédent"><FiChevronLeft /></button>
      <div className="carousel-logos">
        {getVisible().map((logo, i) => (
          <img src={logo} alt={`Partenaire ${i+1}`} key={i} className="partner-logo-refonte" />
        ))}
      </div>
      <button className="carousel-arrow right" onClick={next} aria-label="Suivant"><FiChevronRight /></button>
    </div>
  );
}
const faqs = [
  { icon: <FiHelpCircle />, q: "Est-ce adapté à toutes les cultures ?", a: "Oui, nos solutions sont personnalisées pour chaque type de culture." },
  { icon: <FiAward />, q: "Proposez-vous un suivi après installation ?", a: "Oui, notre équipe reste disponible pour vous accompagner au quotidien." },
  { icon: <FiClock />, q: "Quels sont les délais d'installation ?", a: "En général, l'installation est réalisée sous 2 à 4 semaines après validation du projet." },
  { icon: <FiCloud />, q: "Peut-on suivre la consommation d'eau à distance ?", a: "Oui, nos systèmes connectés permettent un suivi en temps réel via une application dédiée." },
  { icon: <FiTrendingUp />, q: "Aidez-vous à obtenir des subventions ?", a: "Nous vous accompagnons dans la constitution de dossiers pour bénéficier d'aides ou de subventions agricoles." },
];

// Ajout d'un composant WaveSeparator
function WaveSeparator({ color = "#f1f8e9", flip = false }) {
  return (
    <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0, marginTop: '-2px' }}>
      <svg viewBox="0 0 1440 60" width="100%" height="60" style={{ transform: flip ? 'scaleY(-1)' : undefined }}>
        <path fill={color} d="M0,32L60,37.3C120,43,240,53,360,53.3C480,53,600,43,720,32C840,21,960,11,1080,10.7C1200,11,1320,21,1380,26.7L1440,32L1440,60L1380,60C1320,60,1200,60,1080,60C960,60,840,60,720,60C600,60,480,60,360,60C240,60,120,60,60,60L0,60Z" />
      </svg>
    </div>
  );
}

export default function Services() {
  const [faqOpen, setFaqOpen] = useState(null);
  return (
    <div className="services-page">
      {/* HERO avec vidéo de fond, overlay et animation */}
      <section className="services-hero-refonte">
        <div className="video-banner-container">
          <img 
            src="/Vidéo_Irrigation_Automatique_Prête.gif" 
            alt="Animation d'un système d'irrigation automatisé"
            className="realisation-hero-video"
          />
          <div className="video-banner-overlay">
            <h2>L'innovation au cœur de notre métier</h2>
            <p>Découvrez comment nous mettons la technologie au service d'une agriculture plus performante et durable.</p>
          </div>
        </div>
        <motion.div className="hero-content-block" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          <h1>Des services <span className="hero-highlight">innovants</span> pour une agriculture performante</h1>
          <p>Optimisez votre exploitation grâce à la technologie, l'accompagnement humain et l'expertise terrain.</p>
          <a href="#services-list" className="services-hero-btn">Découvrir nos solutions</a>
        </motion.div>
        <button className="scroll-down-btn" onClick={() => {
          const nextSection = document.querySelector('#services-list');
          if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
        }} aria-label="Faire défiler vers le bas">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </section>

      {/* SERVICES avec animation d'entrée */}
      <motion.section id="services-list" className="services-list-refonte" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}>
        <h2 className="section-title">Nos Solutions Complètes pour une Agriculture d'Avenir</h2>
        <p className="services-grid-subtitle" style={{textAlign: 'center', maxWidth: 800, margin: '0 auto 2.5rem auto'}}>
          Chez SERVAGRI, nous transformons l'agriculture grâce à des technologies de pointe et une expertise inégalée. Découvrez nos services sur mesure, conçus pour maximiser votre productivité tout en préservant vos ressources.
        </p>
        <div className="services-grid-refonte">
          {services.map((s, i) => (
            <motion.div className="service-card-refonte" key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: i * 0.12 }} whileHover={{ scale: 1.05, boxShadow: "0 16px 40px rgba(46,125,50,0.18)" }}>
              <div className="service-img-refonte" style={{position:'relative'}}>
                {s.video ? (
                  <video
                    className="service-video-refonte"
                    preload="auto"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={s.img}
                  >
                    <source src={s.video.replace('.mp4', '.webm')} type="video/webm" />
                    <source src={s.video} type="video/mp4" />
                    Votre navigateur ne supporte pas la vidéo HTML5.
                  </video>
                ) : (
                  <img src={s.img} alt={s.title} />
                )}
                <div className="service-img-overlay" />
              </div>
              <div className="service-icon-refonte">{s.icon}</div>
              {s.badge && <div className={`service-badge ${s.badgeClass}`}>{s.badge}</div>}
              {s.isNew && <span className="service-badge-nouveau">Nouveau</span>}
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* AVANTAGES */}
      <section className="services-advantages-refonte">
        <h2 className="section-title">Pourquoi choisir SERVAGRI&nbsp;?</h2>
        <div className="advantages-grid-refonte">
          {avantages.map((a, i) => (
            <motion.div className="advantage-card-refonte" key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: i * 0.12 }}>
              <div className="advantage-icon-refonte">{a.icon}</div>
              <h4>{a.title}</h4>
              <p>{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="services-process-refonte">
        <h2 className="section-title">Comment ça marche&nbsp;?</h2>
        <div className="process-timeline-refonte">
          {process.map((step, i) => (
            <motion.div className="process-step-refonte" key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: i * 0.12 }}>
              <div className="process-step-number">{step.step}</div>
              <div className="process-step-content">
                <h5>{step.title}</h5>
                <p>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="services-testimonials-refonte">
        <h2 className="section-title">Ils nous font confiance</h2>
        <div className="testimonials-grid-refonte">
          {testimonials.map((t, i) => (
            <motion.div className="testimonial-card-refonte" key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: i * 0.12 }}>
              <img src={t.img} alt={t.name} className="testimonial-img-refonte" />
              <blockquote>"{t.quote}"</blockquote>
              <div className="testimonial-name-refonte">{t.name}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PARTENAIRES */}
      <section className="services-partners-refonte">
        <h2 className="section-title">Nos partenaires</h2>
        <PartnerCarousel />
      </section>

      {/* FAQ */}
      <section className="services-faq-refonte">
        <h2 className="section-title">Questions fréquentes</h2>
        <div className="faq-list-refonte">
          {faqs.map((faq, i) => (
            <div className={`faq-item-refonte${faqOpen === i ? ' open' : ''}`} key={i}>
              <div className="faq-question-refonte" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                <span className="faq-icon-refonte">{faq.icon}</span>
                {faq.q}
                <span className="faq-toggle-refonte"><FiChevronDown /></span>
              </div>
              <div className="faq-answer-refonte" style={{ maxHeight: faqOpen === i ? 200 : 0, opacity: faqOpen === i ? 1 : 0, transition: 'max-height 0.5s cubic-bezier(.4,2,.6,1), opacity 0.4s' }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 