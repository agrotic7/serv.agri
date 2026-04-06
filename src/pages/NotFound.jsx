import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMail, FiMapPin } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      textAlign: 'center',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#c8e6c9' }}><FiMapPin /></div>
        <h1 style={{
          fontSize: 'clamp(4rem, 10vw, 8rem)',
          fontWeight: 800,
          color: '#c8e6c9',
          lineHeight: 1,
          margin: 0,
          letterSpacing: '-2px',
        }}>404</h1>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 4vw, 2rem)',
          fontWeight: 700,
          color: '#1a3c1f',
          margin: '1rem 0 1rem 0',
        }}>Page introuvable</h2>
        <p style={{
          color: '#6b7280',
          fontSize: '1.125rem',
          maxWidth: 500,
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6,
        }}>
          La page que vous recherchez semble avoir été déplacée ou n'existe plus. 
          Veuillez vérifier l'URL ou retourner à l'accueil de la plateforme.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: '#1a3c1f', color: '#fff', padding: '0.9rem 2rem', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(26,60,31,0.2)' }}
          >
            <FiArrowLeft /> Retour à l'accueil
          </Link>
          <Link
            to="/contact"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'transparent', color: '#1a3c1f', padding: '0.9rem 2rem', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', border: '1px solid #c8e6c9', transition: 'all 0.2s' }}
          >
            <FiMail /> Nous contacter
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
