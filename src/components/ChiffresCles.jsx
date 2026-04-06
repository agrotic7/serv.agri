import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import './ChiffresCles.css';

const chiffres = [
  { icon: 'bi bi-people-fill', value: 500, label: 'Clients Satisfaits', suffix: '+' },
  { icon: 'bi bi-droplet-fill', value: 1000, label: 'Hectares Irrigués', suffix: '+' },
  { icon: 'bi bi-tree-fill', value: 40, label: "d'Économie d'Eau", suffix: '%' },
  { icon: 'bi bi-gear-fill', value: 1000, label: 'Installations Réalisées', suffix: '+' }
];

function ChiffreItem({ icon, value, label, suffix }) {
  const { ref, inView } = useInView({
    triggerOnce: true, // L'animation ne se joue qu'une seule fois
    threshold: 0.1,
  });

  return (
    <div className={`chiffre-item ${inView ? 'is-visible' : ''}`} ref={ref}>
      <div className="chiffre-icon">
        <i className={icon}></i>
      </div>
      <div className="chiffre-value">
        {inView ? <CountUp end={value} duration={2.5} separator=" " /> : '0'}
        <span className="chiffre-suffix">{suffix}</span>
      </div>
      <div className="chiffre-label">{label}</div>
    </div>
  );
}

function ChiffresCles() {
  return (
    <section className="chiffres-cles-section">
      <div className="chiffres-cles-container">
        <div className="chiffres-cles-title">
          <h2>Nos Chiffres Clés</h2>
          <p>Des résultats concrets qui parlent d'eux-mêmes</p>
        </div>
        
        <div className="chiffres-cles-grid">
          {chiffres.map((chiffre, index) => (
            <ChiffreItem key={index} {...chiffre} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ChiffresCles; 