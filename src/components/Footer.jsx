import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setMessage('Veuillez entrer un email valide.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('newsletter').insert([{ email }]);
    setLoading(false);
    if (error) {
      if (error.code === '23505' || error.message.includes('duplicate')) {
        setMessage('Cet email est déjà inscrit.');
      } else {
        setMessage("Une erreur s'est produite. Veuillez réessayer.");
      }
    } else {
      setMessage('Merci pour votre inscription !');
      setEmail('');
    }
  };

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
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit} style={{marginTop:'0.7rem', display:'flex', gap:'0.5rem', alignItems:'center'}}>
            <input
              type="email"
              className="newsletter-input"
              placeholder="Votre email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              required
              style={{padding:'0.5rem 1rem', borderRadius:'20px', border:'1px solid #c8d7c1', fontSize:'1rem'}}
            />
            <button type="submit" className="newsletter-btn" disabled={loading} style={{minWidth:'120px'}}>
              {loading ? 'Envoi...' : "+ Je m'inscris"}
            </button>
          </form>
          {message && <div style={{marginTop:'0.5rem', color: message.includes('Merci') ? '#4bbf73' : '#c0392b', fontWeight:500, fontSize:'0.98rem'}}>{message}</div>}
        </div>
        <div className="footer-newsletter-right">
          <button
            className="footer-scrolltop"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Retour en haut"
            style={{background:'none',border:'none',cursor:'pointer',color:'inherit',padding:0}}
          >
            <i className="fas fa-arrow-up"></i>
          </button>
        </div>
      </div>
      <div className="footer-main">
        <div className="footer-col address">
          <span className="footer-col-title">Coordonnées</span>
          <span className="footer-col-title mt">Téléphone</span>
          <span className="footer-phone">+221 77 027 92 69</span>
          <span className="footer-col-title mt" style={{ marginTop: '1rem', display: 'block' }}>Email</span>
          <span className="footer-phone" style={{ fontSize: '1rem', color: '#6b7280' }}>servagri4@gmail.com</span>
        </div>
        <div className="footer-col pages">
          <span className="footer-col-title">Pages</span>
          <Link to="/"><span>Accueil</span></Link>
          <Link to="/services"><span>Services</span></Link>
          <Link to="/realisation"><span>Réalisations</span></Link>
          <Link to="/actualites"><span>Actualités</span></Link>
          <Link to="/contact"><span>Contact</span></Link>
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
            <a href="#" className="footer-social-icon" title="LinkedIn: Servagri Sn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className="footer-social-icon" title="Youtube: ServAgri"><i className="fab fa-youtube"></i></a>
            <a href="#" className="footer-social-icon" title="TikTok: serv.agri"><i className="fab fa-tiktok"></i></a>
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