import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { motion } from 'framer-motion';
import { FiSettings, FiSave, FiGlobe, FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi';
import './Admin.css';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    site_name: 'SERVAGRI',
    site_description: 'L’agriculture de précision du champ à votre écran.',
    contact_email: 'contact@servagri.sn',
    contact_phone: '+221 77 027 92 69',
    address: 'Kaolack, Sénégal',
    facebook_url: '',
    instagram_url: '',
    linkedin_url: '',
    twitter_url: '',
    whatsapp_number: '221770279269',
    hero_title: 'L’agriculture de précision du champ à votre écran.',
    hero_subtitle: 'Optimisez vos rendements avec nos solutions d’irrigation connectée et d’analyse agronomique.',
    hero_video_url: '/servagri_hero.mp4'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();
      
      if (data && !error) {
        setSettings(data);
      } else if (error && error.code === 'PGRST116') {
        // Table existante mais vide, on garde les valeurs par défaut
        console.log('No settings found, using defaults.');
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // On essaie de mettre à jour ou d'insérer l'unique ligne de réglages
      const { error } = await supabase
        .from('settings')
        .upsert({ id: settings.id || 1, ...settings });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Paramètres enregistrés avec succès !' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Erreur lors de l’enregistrement : ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#4bbf73' }}>Chargement des paramètres...</div>;
  }

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <span className="admin-page-icon"><FiSettings /></span>
        <div>
          <h2>Configuration Générale</h2>
          <p className="admin-page-desc">Gérez les informations globales de votre site web.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form-settings">
        <div className="settings-grid">
          
          {/* Section: Informations de base */}
          <div className="settings-card">
            <h3><FiGlobe /> Identité du Site</h3>
            <div className="form-group">
              <label>Nom du site</label>
              <input name="site_name" value={settings.site_name} onChange={handleChange} placeholder="Ex: SERVAGRI" />
            </div>
            <div className="form-group">
              <label>Slogan / Description courte</label>
              <textarea name="site_description" value={settings.site_description} onChange={handleChange} rows="3" />
            </div>
          </div>

          {/* Section: Contact */}
          <div className="settings-card">
            <h3><FiPhone /> Contact & Localisation</h3>
            <div className="form-group">
              <label>Email de contact</label>
              <input type="email" name="contact_email" value={settings.contact_email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input name="contact_phone" value={settings.contact_phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Numéro WhatsApp (sans + ni espaces)</label>
              <input name="whatsapp_number" value={settings.whatsapp_number} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Adresse physique</label>
              <input name="address" value={settings.address} onChange={handleChange} />
            </div>
          </div>

          {/* Section: Réseaux Sociaux */}
          <div className="settings-card">
            <h3><FiLinkedin /> Réseaux Sociaux</h3>
            <div className="form-group">
              <label><FiFacebook /> Facebook URL</label>
              <input name="facebook_url" value={settings.facebook_url} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label><FiInstagram /> Instagram URL</label>
              <input name="instagram_url" value={settings.instagram_url} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label><FiLinkedin /> LinkedIn URL</label>
              <input name="linkedin_url" value={settings.linkedin_url} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label><FiTwitter /> Twitter URL</label>
              <input name="twitter_url" value={settings.twitter_url} onChange={handleChange} />
            </div>
          </div>

          {/* Section: Page d'accueil */}
          <div className="settings-card">
            <h3>🎨 Hero Section (Accueil)</h3>
            <div className="form-group">
              <label>Titre Principal</label>
              <textarea name="hero_title" value={settings.hero_title} onChange={handleChange} rows="2" />
            </div>
            <div className="form-group">
              <label>Sous-titre</label>
              <textarea name="hero_subtitle" value={settings.hero_subtitle} onChange={handleChange} rows="3" />
            </div>
            <div className="form-group">
              <label>URL de la Vidéo (Hero)</label>
              <input name="hero_video_url" value={settings.hero_video_url} onChange={handleChange} placeholder="/mavideo.mp4" />
            </div>
          </div>

        </div>

        {message.text && (
          <div className={`form-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="settings-actions">
          <button type="submit" className="submit-btn" disabled={saving}>
            <FiSave /> {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 2rem;
        }
        .settings-card {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
        }
        .settings-card h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.15rem;
          color: #1a3c1f;
          margin-bottom: 20px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 12px;
        }
        .form-message {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        .form-message.success { background: #eaffea; color: #207c2f; border: 1px solid #207c2f; }
        .form-message.error { background: #ffebee; color: #c62828; border: 1px solid #c62828; }
        .settings-actions {
          display: flex;
          justify-content: flex-end;
        }
        @media (max-width: 768px) {
          .settings-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
