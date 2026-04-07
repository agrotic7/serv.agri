import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDroplet, FiTrendingDown, FiClock, FiAlertTriangle, FiCpu, FiPieChart, FiSmartphone, FiCloud, FiArrowRight } from 'react-icons/fi';
import './ProblemSolution.css';

const problems = [
  { icon: <FiDroplet />, text: "Gaspillage hydrique massif lié à l'irrigation traditionnelle." },
  { icon: <FiTrendingDown />, text: "Rendements imprévisibles par manque de données agronomiques." },
  { icon: <FiClock />, text: "Ressources chronophages pour la surveillance manuelle." },
  { icon: <FiAlertTriangle />, text: "Gestion réactive face au stress hydrique des cultures." },
];

const solutions = [
  { icon: <FiCpu />, text: "Irrigation automatisée pilotée par algorithmes et capteurs IoT." },
  { icon: <FiPieChart />, text: "Tableaux de bord analytiques en temps réel par parcelle." },
  { icon: <FiSmartphone />, text: "Contrôle à distance et alertes instantanées avec monitoring." },
  { icon: <FiCloud />, text: "Intégration des données météorologiques prédictives." },
];

function Item({ icon, text, type }) {
  return (
    <div className={`ps-item ${type}`}>
      <span className="ps-item-icon">{icon}</span>
      <span className="ps-item-text">{text}</span>
    </div>
  );
}

export default function ProblemSolution() {
  return (
    <section className="problem-solution-section">
      <div className="ps-container">
        <div className="ps-header">
          <h2 className="ps-title">L'agriculture traditionnelle face à ses limites</h2>
          <p className="ps-subtitle">SERVAGRI déploie des solutions technologiques pour optimiser vos rendements et sécuriser vos exploitations.</p>
        </div>
        <div className="ps-columns">
          <motion.div
            className="ps-col problem"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="ps-col-header">
              <h3>Défis Actuels</h3>
            </div>
            <div className="ps-items">
              {problems.map((p, i) => (
                <Item key={i} icon={p.icon} text={p.text} type="problem" />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="ps-col solution"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="ps-col-header">
              <h3>Solutions SERVAGRI</h3>
            </div>
            <div className="ps-items">
              {solutions.map((s, i) => (
                <Item key={i} icon={s.icon} text={s.text} type="solution" />
              ))}
            </div>
          </motion.div>
        </div>
        <div className="ps-cta">
          <Link to="/services" className="ps-cta-btn">
            Découvrir notre expertise technique <FiArrowRight className="ps-cta-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}
