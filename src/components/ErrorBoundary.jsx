import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ color: '#dc2626', marginBottom: '1rem' }}>
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <h2 style={{ color: '#1a3c1f', fontWeight: 800, marginBottom: '0.75rem', fontSize: '1.75rem' }}>Une erreur inattendue s'est produite</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: 450, lineHeight: 1.6 }}>Nous avons rencontré un problème technique. Nos équipes ont été alertées. Veuillez recharger la page pour réessayer.</p>
          <button onClick={() => window.location.reload()} style={{ background: '#1a3c1f', color: '#fff', border: 'none', padding: '1rem 2.5rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(26,60,31,0.2)' }}>
            Recharger l'application
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '3rem', textAlign: 'left', maxWidth: 800, width: '100%', color: '#dc2626', fontSize: '0.875rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, padding: '1rem', background: '#fee2e2', borderRadius: '6px' }}>Détails de l'erreur (Environnement de développement)</summary>
              <pre style={{ marginTop: '0.5rem', background: '#ffffff', border: '1px solid #fecaca', padding: '1.5rem', borderRadius: '6px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
