import React from 'react';
import './Services.css'; 
import { FiDroplet, FiBarChart2, FiCpu, FiUsers, FiGitMerge, FiBookOpen } from 'react-icons/fi';

const servicesData = [
  {
    icon: <FiDroplet />,
    title: "Systèmes d'Irrigation Intelligente",
    description: "Conception et installation de solutions d'irrigation automatisées et connectées, adaptées aux besoins spécifiques de vos cultures pour une utilisation optimale de l'eau.",
    badge: "Certifié ISO 9001"
  },
  {
    icon: <FiBarChart2 />,
    title: "Analyse et Big Data Agronomique",
    description: "Collecte de données via capteurs et drones, analyse avancée et création de tableaux de bord intuitifs pour une prise de décision éclairée.",
    badge: "IA & Machine Learning"
  },
  {
    icon: <FiCpu />,
    title: "Optimisation de la Consommation d'Eau",
    description: "Solutions de précision pour réduire jusqu'à 40% votre consommation d'eau, en tenant compte des prévisions météo et des besoins réels de vos sols.",
    badge: "Économies Garanties"
  },
  {
    icon: <FiUsers />,
    title: "Support et Accompagnement Personnalisé",
    description: "Une équipe d'experts dédiée à votre succès, offrant un support technique réactif et des conseils agronomiques sur mesure, du diagnostic à la maintenance.",
    badge: "24/7 Support"
  },
  {
    icon: <FiGitMerge />,
    title: "Mise en place de l'Agriculture de Précision",
    description: "Intégration de technologies avancées (drones, capteurs, logiciels) pour une gestion optimisée des parcelles et une productivité accrue.",
    badge: "Innovation"
  },
  {
    icon: <FiBookOpen />,
    title: "Formations et Ateliers Pratiques",
    description: "Formations sur l'utilisation de nos systèmes et les meilleures pratiques agronomiques, pour une autonomie complète de vos équipes.",
    badge: "Expertise"
  },
];

export default function Services() {
  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div 
          className="services-hero-content"
        >
          <span className="services-hero-badge">Notre Expertise</span>
          <h1>Solutions d'Irrigation Intelligente</h1>
          <p>
            Découvrez notre gamme complète de services, conçue pour optimiser votre consommation d'eau et maximiser vos rendements.
          </p>
          <div>
            <a href="#services-grid" className="services-hero-btn">Explorer nos services</a>
          </div>
        </div>
        <div 
          className="services-hero-image"
        >
          <img src="/servagri_irrigation.png" alt="Personne utilisant un téléphone dans un champ irrigué" />
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services-grid" className="services-grid-section">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-dark mb-3">
            Nos Solutions Complètes pour une Agriculture d'Avenir
          </h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '800px' }}>
            Chez SERVAGRI, nous transformons l'agriculture grâce à des technologies de pointe et une expertise inégalée.
            Découvrez nos services sur mesure, conçus pour maximiser votre productivité tout en préservant vos ressources.
          </p>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 justify-content-center">
          {servicesData.map((service, index) => (
            <div className="col" key={index}>
              <div className="card h-100 shadow-sm border-0 rounded-3">
                <div className="card-body d-flex flex-column align-items-center text-center p-4">
                  <div className="p-3 bg-success-subtle text-success rounded-3 mb-4 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                    {service.icon}
                  </div>
                  <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1 mb-3">
                    {service.badge}
                  </span>
                  <h3 className="card-title fs-5 fw-bold text-dark mb-2">
                    {service.title}
                  </h3>
                  <p className="card-text text-muted mb-4 flex-grow-1 text-truncate-multiline">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 