import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Editor } from '@tinymce/tinymce-react';
import { motion } from 'framer-motion';
import { FiSend, FiUsers, FiMail, FiCheckCircle, FiInfo } from 'react-icons/fi';
import './Admin.css';

function AdminNewsletter() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [subCount, setSubCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count, error } = await supabase.from('newsletter').select('*', { count: 'exact', head: true });
      if (!error) setSubCount(count || 0);
    };
    fetchCount();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setMessage({ type: 'error', text: 'Veuillez remplir le titre et le contenu.' });
      return;
    }
    setLoading(true);
    
    // Récupérer tous les emails inscrits
    const { data, error } = await supabase.from('newsletter').select('email');
    
    if (error) {
      setMessage({ type: 'error', text: "Erreur lors de la récupération des emails." });
      setLoading(false);
      return;
    }

    const emails = data.map(e => e.email);
    
    // Simuler l'envoi pour la démo
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: `Newsletter envoyée avec succès à ${emails.length} inscrits ! (Simulation)` });
      setTitle('');
      setContent('');
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }, 1500);
  };

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <span className="admin-page-icon"><FiMail /></span>
        <div>
          <h2>Newsletter</h2>
          <p className="admin-page-desc">Gérez et envoyez vos communications à vos abonnés.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="admin-main-col">
          <div className="admin-card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiSend /> Composer un message
            </h3>
            <form onSubmit={handleSend}>
              <div className="form-group">
                <label>Objet de l'email</label>
                <input 
                  type="text" 
                  placeholder="Ex: Les nouveautés de Servagri - Juillet 2025" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Contenu du message</label>
                <Editor
                  id="newsletter-editor"
                  tinymceScriptSrc="/tinymce/tinymce.min.js"
                  value={content}
                  onEditorChange={setContent}
                  init={{
                    height: 400,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                      'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'help', 'wordcount'
                    ],
                    toolbar:
                      'undo redo | blocks | bold italic underline | forecolor | alignleft aligncenter alignright | bullist numlist | link image | removeformat | help',
                    content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:16px }'
                  }}
                />
              </div>

              {message.text && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`admin-alert ${message.type}`}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    margin: '1.5rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    color: message.type === 'success' ? '#10b981' : '#ef4444',
                    border: `1px solid ${message.type === 'success' ? '#10b98130' : '#ef444430'}`,
                    fontWeight: 500
                  }}
                >
                  {message.type === 'success' ? <FiCheckCircle /> : <FiInfo />}
                  {message.text}
                </motion.div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="submit" disabled={loading} className="btn-pro btn-primary" style={{ minWidth: '240px' }}>
                  <FiSend /> {loading ? 'Envoi en cours...' : 'Diffuser la newsletter'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-card stats-card" style={{ textAlign: 'center' }}>
            <div className="stat-circle" style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              margin: '0 auto 1.5rem auto'
            }}>
              {subCount}
            </div>
            <h4 style={{ margin: 0, color: 'var(--gray-700)' }}>Abonnés actifs</h4>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Personnes ayant consenti à recevoir vos emails.
            </p>
            <button className="btn-pro btn-ghost" style={{ width: '100%', marginTop: '1.5rem' }}>
              <FiUsers /> Voir la liste
            </button>
          </div>

          <div className="admin-card help-card" style={{ background: 'var(--gray-100)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
              <FiInfo /> Conseils
            </h4>
            <ul style={{ paddingLeft: '1.2rem', margin: '1rem 0 0 0', fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
              <li>Personnalisez l'objet pour augmenter le taux d'ouverture.</li>
              <li>Utilisez des images légères pour un affichage rapide.</li>
              <li>Testez vos liens avant l'envoi final.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNewsletter;