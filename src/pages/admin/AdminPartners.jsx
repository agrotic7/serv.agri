import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiPlus, FiTrash2, FiEdit2, FiUploadCloud, FiSmile } from 'react-icons/fi';
import './Admin.css';

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [form, setForm] = useState({ name: '', logo: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => { fetchPartners(); }, []);

  async function fetchPartners() {
    const { data, error } = await supabase.from('partners').select('*').order('id', { ascending: true });
    if (!error) setPartners(data || []);
  }

  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  async function handleLogoUpload(file) {
    if (!file) return '';
    const ext = file.name.split('.').pop();
    const fileName = `logos/${Date.now()}-${Math.random().toString(36).substring(2,8)}.${ext}`;
    const { error } = await supabase.storage.from('partners').upload(fileName, file, { upsert: false });
    if (error) { alert(`Erreur upload logo: ${error.message}`); return ''; }
    const { data: publicUrlData } = supabase.storage.from('partners').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let logoUrl = form.logo;
    if (logoFile) logoUrl = await handleLogoUpload(logoFile);
    const toSave = { name: form.name, logo: logoUrl };
    
    if (editingId) {
      await supabase.from('partners').update(toSave).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('partners').insert([toSave]);
    }
    
    setForm({ name: '', logo: '' });
    setLogoFile(null);
    setLogoPreview(null);
    setLoading(false);
    fetchPartners();
  }

  async function handleDelete(id) {
    if (window.confirm('Supprimer ce partenaire ?')) {
      await supabase.from('partners').delete().eq('id', id);
      fetchPartners();
    }
  }

  function handleEdit(p) {
    setForm({ name: p.name, logo: p.logo });
    setLogoPreview(p.logo);
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <span className="admin-page-icon"><FiUsers /></span>
        <div>
          <h2>Partenaires & Clients</h2>
          <p className="admin-page-desc">Gérez les logos des entreprises qui vous font confiance.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="admin-main-col">
          <div className="admin-card">
            <h3>{editingId ? 'Modifier le partenaire' : 'Ajouter un nouveau partenaire'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom de l'entreprise</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  placeholder="Ex: FAO, Ministère de l'Agriculture..." 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Logo du partenaire</label>
                <div 
                  className="media-upload-pro" 
                  onClick={() => document.getElementById('logo-upload').click()}
                >
                  <FiUploadCloud size={30} style={{ marginBottom: '10px', color: 'var(--primary)' }} />
                  <p style={{ margin: 0, fontWeight: 500 }}>Cliquez pour uploader un logo</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '4px' }}>Format PNG, JPG ou SVG (max 2Mo)</p>
                  <input 
                    type="file" 
                    id="logo-upload" 
                    hidden 
                    accept="image/*" 
                    onChange={handleLogoChange} 
                  />
                </div>
                
                {logoPreview && (
                  <div className="media-preview-pro" style={{ height: '120px', marginTop: '1rem', background: '#fff', border: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={logoPreview} alt="Aperçu" style={{ objectFit: 'contain', padding: '10px' }} />
                  </div>
                )}
              </div>

              <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                <button type="submit" className="btn-pro btn-primary" disabled={loading}>
                  {editingId ? <FiEdit2 /> : <FiPlus />} {loading ? 'Traitement...' : editingId ? 'Enregistrer les modifications' : 'Ajouter au catalogue'}
                </button>
                {editingId && (
                  <button type="button" className="btn-pro btn-ghost" onClick={() => { setEditingId(null); setForm({name:'', logo:''}); setLogoPreview(null); }}>
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-list">
            <h3>Liste des partenaires</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <AnimatePresence>
                {partners.map((p, idx) => (
                  <motion.div 
                    key={p.id}
                    className="list-item"
                    style={{ padding: '0.75rem 1rem' }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="item-img" style={{ width: '40px', height: '40px', background: '#fff' }}>
                      <img src={p.logo} alt="" style={{ objectFit: 'contain' }} />
                    </div>
                    <div className="item-info">
                      <h4 style={{ fontSize: '0.95rem' }}>{p.name}</h4>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleEdit(p)} className="btn-pro btn-ghost" style={{ padding: '5px' }} title="Modifier"><FiEdit2 size={14} /></button>
                      <button onClick={() => handleDelete(p.id)} className="btn-pro btn-ghost btn-danger" style={{ padding: '5px' }} title="Supprimer"><FiTrash2 size={14} /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {partners.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>
                  <FiSmile size={32} style={{ marginBottom: '10px' }} />
                  <p>Aucun partenaire pour le moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}