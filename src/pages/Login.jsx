import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { email, password } = credentials;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Identifiants incorrects ou compte inexistant.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } else {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin');
    }
  };

  return (
    <div className="login-bg-illustration">
      <div className="login-outer-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="login-container"
        >
          <div className="login-halo"></div>
          <motion.div
            className={`login-box glass-effect${shake ? ' shake' : ''}`}
            animate={shake ? { x: [0, -16, 16, -12, 12, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="login-badge">Admin</span>
            <div className="login-avatar">
              <svg width="44" height="44" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="30" fill="#e6f4ee"/><path d="M30 32c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm0 4c-6.627 0-20 3.314-20 10v4h40v-4c0-6.686-13.373-10-20-10z" fill="#4bbf73"/></svg>
            </div>
            <img src="/servagri_logo.png" alt="Logo Servagri" className="login-logo" />
            <h1>Administration SERVAGRI</h1>
            <p className="login-subtitle">Connectez-vous à votre espace sécurisé</p>
            <p className="login-welcome">Bienvenue sur la plateforme d'administration <span className="brand">SERVAGRI</span> !</p>
            <form onSubmit={handleSubmit} className="login-form">
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="form-group with-icon">
                <span className="input-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm8 2a4 4 0 100 8 4 4 0 000-8zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#4bbf73"/></svg>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  autoComplete="username"
                  aria-label="Adresse email"
                />
              </div>
              <div className="form-group with-icon">
                <span className="input-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-7V7a6 6 0 10-12 0v3a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2zm-8-3a4 4 0 118 0v3H6V7z" fill="#4bbf73"/></svg>
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={credentials.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  aria-label="Mot de passe"
                />
              </div>
              <div className="login-links">
                <a href="#" className="forgot-link">Mot de passe oublié ?</a>
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                <span className="btn-icon">
                  <svg className={loading ? 'spin' : ''} width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm6.364 3.636a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 1 1-1.414 1.414l-1.414-1.414a1 1 0 0 1 0-1.414zM21 11a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2h2zm-2.222 7.364a1 1 0 0 1 0-1.414l1.414-1.414a1 1 0 1 1 1.414 1.414l-1.414 1.414a1 1 0 0 1-1.414 0zM12 19a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm-7.364-3.636a1 1 0 0 1 0-1.414l1.414-1.414a1 1 0 1 1 1.414 1.414l-1.414 1.414a1 1 0 0 1-1.414 0zM5 13a1 1 0 1 1 0-2H3a1 1 0 1 1 0 2h2zm2.222-7.364a1 1 0 0 1 1.414 0l-1.414 1.414A1 1 0 1 1 6.222 5.636z" fill="#fff"/>
                  </svg>
                </span>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </motion.div>
          <footer className="login-footer">
            &copy; {new Date().getFullYear()} SERVAGRI. Tous droits réservés.
          </footer>
        </motion.div>
      </div>
      <div className="login-bg-blur"></div>
    </div>
  );
}

export default Login; 