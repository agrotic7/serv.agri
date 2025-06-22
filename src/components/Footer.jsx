import React from 'react';
import './Footer.css'; // Importation du fichier CSS

function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-newsletter">
        <div className="footer-newsletter-left">
          <img src="/servagri_logo.png" alt="SERVAGRI Logo" className="footer-logo" />
          <div className="footer-brand-text">
            <span className="footer-brand-title">SERVAGRI</span>
            <span className="footer-brand-subtitle">Les TICs au service de l'agriculture</span>
          </div>
        </div>
        <div className="footer-newsletter-center">
          <span className="newsletter-title">NEWSLETTER</span>
          <span className="newsletter-desc">Inscrivez-vous pour ne rien manquer</span>
        </div>
        <div className="footer-newsletter-right">
          <button className="newsletter-btn">+ Je m'inscris</button>
          <span className="footer-scrolltop"><i className="fas fa-arrow-up"></i></span>
        </div>
      </div>
      <div className="footer-main">
        <div className="footer-col address">
          <span className="footer-col-title">Dakar, Sénégal</span>
          <span className="footer-col-title mt">Téléphone</span>
          <span className="footer-phone">+221 77 445 19 82</span>
        </div>
        <div className="footer-col pages">
          <span className="footer-col-title">Pages</span>
          <a href="/"><span>Accueil</span></a>
          <a href="/services"><span>Services</span></a>
          <a href="/realisations"><span>Réalisations</span></a>
          <a href="/actualites"><span>Actualités</span></a>
          <a href="/contact"><span>Contact</span></a>
        </div>
        <div className="footer-col infos">
          <span className="footer-col-title">Informations</span>
          <span>Mentions légales</span>
          <span>Conditions générales de vente</span>
          <span>Protection des données</span>
          <span>Gestion des cookies</span>
          <span>Contact</span>
        </div>
        <div className="footer-col social">
          <div className="footer-social-icons">
            <a href="#" className="footer-social-icon"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="footer-social-icon"><i className="fab fa-instagram"></i></a>
            <a href="#" className="footer-social-icon"><i className="fab fa-youtube"></i></a>
          </div>
          <div className="footer-realisation">
            <i className="fas fa-code"></i> Réalisation Madu_Tech
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 