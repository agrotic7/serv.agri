import React from 'react';
import './Atouts.css';

const atouts = [
  {
    icon: (
      <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><path d="M12 2C7 2 2 7 2 12c0 5 5 10 10 10s10-5 10-10c0-5-5-10-10-10zm0 18c-4.41 0-8-3.59-8-8 0-1.1.9-2 2-2s2 .9 2 2c0 2.21 1.79 4 4 4s4-1.79 4-4c0-1.1.9-2 2-2s2 .9 2 2c0 4.41-3.59 8-8 8z" fill="#43a047"/></svg>
    ),
    title: "Irrigation automatisée",
    desc: "Des systèmes connectés pour arroser au bon moment, sans gaspillage."
  },
  {
    icon: (
      <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" fill="#4f8cff"/><path d="M7 12h10M12 7v10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Analyse de données",
    desc: "Capteurs et tableaux de bord pour piloter vos cultures en temps réel."
  },
  {
    icon: (
      <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6" fill="#43a047"/><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: "Économie d'eau",
    desc: "Jusqu'à 40% d'eau économisée grâce à la précision et la météo."
  },
  {
    icon: (
      <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2563eb"/><path d="M12 8v4l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Accompagnement sur-mesure",
    desc: "Un expert vous suit de l'étude à la maintenance, partout au Sénégal."
  },
];

function Atouts() {
  return (
    <section className="atouts-section">
      <h2>Pourquoi choisir SERVAGRI&nbsp;?</h2>
      <div className="atouts-grid">
        {atouts.map((atout, index) => (
          <div className="atout-card" key={index}>
            <div className="atout-icon">
              {atout.icon}
            </div>
            <h3>{atout.title}</h3>
            <p>{atout.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Atouts; 