import React from 'react';
import './Services.css';
import { FiDroplet, FiBarChart2, FiCpu, FiUsers, FiGitMerge, FiBookOpen, FiCheckCircle, FiPhoneCall, FiSearch, FiSettings, FiTrendingUp, FiSmile, FiArrowRight, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';

const servicesData = [
  {
    icon: <FiDroplet />,
    title: "Systèmes d'Irrigation Intelligente",
    description: "Conception et installation de solutions d'irrigation automatisées et connectées, adaptées aux besoins spécifiques de vos cultures pour une utilisation optimale de l'eau.",
    badge: "Certifié ISO 9001",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
  },
  {
    icon: <FiBarChart2 />,
    title: "Analyse et Big Data Agronomique",
    description: "Collecte de données via capteurs et drones, analyse avancée et création de tableaux de bord intuitifs pour une prise de décision éclairée.",
    badge: "IA & Machine Learning",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
  },
  {
    icon: <FiCpu />,
    title: "Optimisation de la Consommation d'Eau",
    description: "Solutions de précision pour réduire jusqu'à 40% votre consommation d'eau, en tenant compte des prévisions météo et des besoins réels de vos sols.",
    badge: "Économies Garanties",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80"
  },
  {
    icon: <FiUsers />,
    title: "Support et Accompagnement Personnalisé",
    description: "Une équipe d'experts dédiée à votre succès, offrant un support technique réactif et des conseils agronomiques sur mesure, du diagnostic à la maintenance.",
    badge: "24/7 Support",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
  },
  {
    icon: <FiGitMerge />,
    title: "Mise en place de l'Agriculture de Précision",
    description: "Intégration de technologies avancées (drones, capteurs, logiciels) pour une gestion optimisée des parcelles et une productivité accrue.",
    badge: "Innovation",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  },
  {
    icon: <FiBookOpen />,
    title: "Formations et Ateliers Pratiques",
    description: "Formations sur l'utilisation de nos systèmes et les meilleures pratiques agronomiques, pour une autonomie complète de vos équipes.",
    badge: "Expertise",
    img: "https://images.unsplash.com/photo-1465101178521-c1a9136a3fd8?auto=format&fit=crop&w=400&q=80"
  },
];

const avantages = [
  {
    icon: <FiCheckCircle />,
    title: "Technologies de pointe",
    desc: "Des solutions innovantes et connectées pour une agriculture durable."
  },
  {
    icon: <FiCheckCircle />,
    title: "Accompagnement personnalisé",
    desc: "Un suivi expert à chaque étape de votre projet."
  },
  {
    icon: <FiCheckCircle />,
    title: "Économies garanties",
    desc: "Optimisez vos ressources et réduisez vos coûts durablement."
  },
];

const processSteps = [
  { icon: <FiSearch />, title: "Diagnostic", desc: "Analyse de vos besoins et de votre parcelle." },
  { icon: <FiSettings />, title: "Installation", desc: "Mise en place des solutions sur-mesure." },
  { icon: <FiTrendingUp />, title: "Suivi & Optimisation", desc: "Contrôle, ajustements et conseils continus." },
  { icon: <FiSmile />, title: "Résultats", desc: "Productivité et économies maximisées !" },
];

const testimonials = [
  { name: "Awa D.", photo: "/servagri_logo.png", quote: "Grâce à SERVAGRI, j'ai réduit ma consommation d'eau et augmenté mes rendements !" },
  { name: "Moussa K.", photo: "/servagri_logo.png", quote: "L'accompagnement personnalisé fait vraiment la différence." },
  { name: "Fatou S.", photo: "/servagri_logo.png", quote: "Des solutions innovantes et une équipe à l'écoute !" },
];

const partners = [
  "/servagri_logo.png",
  "/servagri_irrigation.png",
  "/vite.svg"
];

const faqs = [
  { q: "Quels sont les avantages de l'irrigation intelligente ?", a: "Une gestion optimisée de l'eau, des économies et de meilleurs rendements." },
  { q: "Proposez-vous un accompagnement après installation ?", a: "Oui, notre équipe assure un suivi et un support technique 24/7." },
  { q: "Vos solutions sont-elles adaptées à toutes les cultures ?", a: "Oui, nous personnalisons chaque projet selon vos besoins." },
];

const stats = [
  { value: '200+', label: 'Clients satisfaits' },
  { value: '98%', label: 'Taux de satisfaction' },
  { value: '15', label: "Années d'expertise" },
  { value: '40%', label: "Économies d'eau" },
];

export default function Services() {
  const [faqOpen, setFaqOpen] = React.useState(null);
  return (
    <div className="services-page">
      {/* HERO SECTION PREMIUM */}
      <section className="services-hero-premium">
        <div className="hero-bg-svg">
          {/* SVG background décoratif */}
          <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-svg-bg">
            <defs>
              <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e0f7fa" />
                <stop offset="100%" stopColor="#a5d6a7" />
              </linearGradient>
            </defs>
            <path fill="url(#heroGradient)" fillOpacity="1" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
          </svg>
        </div>
        <div className="services-hero-content-premium">
          <span className="services-hero-badge">Notre Expertise</span>
          <h1>
            <span>Des services </span>
            <span className="hero-highlight">innovants</span>
            <span> pour une </span>
            <span className="hero-highlight">agriculture performante</span>
          </h1>
          <p>
            Découvrez comment <b>SERVAGRI</b> révolutionne l'agriculture grâce à la technologie, l'accompagnement humain et l'innovation durable.
          </p>
          <div className="hero-btns">
            <a href="#services-grid" className="services-hero-btn"><FiArrowRight style={{marginRight:8}}/> Découvrir nos services</a>
            <a href="/contact" className="services-hero-btn secondary"><FiMail style={{marginRight:8}}/> Demander un devis</a>
          </div>
        </div>
        <div className="services-hero-image-premium">
          <img src="/servagri_irrigation.png" alt="Irrigation intelligente" />
        </div>
      </section>

      {/* STATISTIQUES CLÉS */}
      <section className="services-stats-section">
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <motion.div
              className="stat-card"
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vidéo de présentation */}
      <section className="services-video-section">
        <div className="video-wrapper">
          <video controls poster="/servagri.png" className="services-video">
            <source src="/Vidéo_Irrigation_Automatique_Prête.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo.
          </video>
        </div>
      </section>

      {/* SERVICES GRID PREMIUM */}
      <section id="services-grid" className="services-grid-section-premium">
        <div className="services-grid-header">
          <h2 className="services-grid-title">Nos Solutions Complètes pour une Agriculture d'Avenir</h2>
          <p className="services-grid-subtitle">
            Chez SERVAGRI, nous transformons l'agriculture grâce à des technologies de pointe et une expertise inégalée.
            Découvrez nos services sur mesure, conçus pour maximiser votre productivité tout en préservant vos ressources.
          </p>
        </div>
        <div className="services-grid services-grid-premium">
          {servicesData.map((service, index) => (
            <motion.div
              className="service-card-premium"
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ scale: 1.07, rotate: -2, boxShadow: "0 16px 40px rgba(67,160,71,0.18)" }}
            >
              <div className="service-img-wrapper">
                <img src={service.img} alt={service.title} className="service-img" />
              </div>
              <div className="service-icon-premium">{service.icon}</div>
              <span className="badge service-badge">{service.badge}</span>
              <div className="service-card-title">{service.title}</div>
              <div className="service-card-description">{service.description}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Processus Section */}
      <section className="services-process-section">
        <h3 className="process-title">Comment ça marche&nbsp;?</h3>
        <div className="process-steps">
          {processSteps.map((step, idx) => (
            <motion.div
              className="process-step"
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <div className="process-icon">{step.icon}</div>
              <div className="process-step-title">{step.title}</div>
              <div className="process-step-desc">{step.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Avantages Section */}
      <section className="services-advantages-section">
        <h3 className="advantages-title">Pourquoi choisir SERVAGRI&nbsp;?</h3>
        <div className="advantages-grid">
          {avantages.map((av, idx) => (
            <div className="advantage-card" key={idx}>
              <div className="advantage-icon">{av.icon}</div>
              <div className="advantage-title">{av.title}</div>
              <div className="advantage-desc">{av.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="services-testimonials-section">
        <h3 className="testimonials-title">Ils nous font confiance</h3>
        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <motion.div
              className="testimonial-card"
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.18 }}
            >
              <img src={t.photo} alt={t.name} className="testimonial-photo" />
              <div className="testimonial-quote">"{t.quote}"</div>
              <div className="testimonial-name">{t.name}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partenaires Section */}
      <section className="services-partners-section">
        <div className="partners-title">Nos partenaires</div>
        <div className="partners-logos">
          {partners.map((logo, idx) => (
            <img src={logo} alt={`Partenaire ${idx+1}`} key={idx} className="partner-logo" />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="services-faq-section">
        <h3 className="faq-title">Questions fréquentes</h3>
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div className={`faq-item${faqOpen === idx ? ' open' : ''}`} key={idx}>
              <div className="faq-question" onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}>
                {faq.q}
                <span className="faq-toggle">{faqOpen === idx ? '-' : '+'}</span>
              </div>
              <div className="faq-answer" style={{ display: faqOpen === idx ? 'block' : 'none' }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 