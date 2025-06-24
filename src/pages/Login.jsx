import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loadingSession, setLoadingSession] = useState(true);

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
    const { email, password } = credentials;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Identifiants incorrects ou compte inexistant.');
    }
    // La redirection se fera automatiquement via useEffect si la session est active
  };

  useEffect(() => {
    let isMounted = true;
    setLoadingSession(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        if (session) {
          navigate('/admin');
        }
        setLoadingSession(false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (session) {
          navigate('/admin');
        }
      }
    });
    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loadingSession) {
    return <div style={{textAlign:'center', marginTop:'4rem'}}>Chargement...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="login-container"
    >
      <div className="login-box">
        <h1>Administration SERVAGRI</h1>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Se connecter
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default Login; 