import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiPlus, FiTrash2, FiEdit2, FiUploadCloud, FiEye, FiCheck, FiX } from 'react-icons/fi';
import './Admin.css';

export default function AdminRealisations() {
  const [realisations, setRealisations] = useState([]);
  const [form, setForm] = useState({ title: '', client: '', description: '', result: '', image: '', status: 'published' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => { fetchRealisations(); }, []);

  async function fetchRealisations() {
    const { data, error } = await supabase.from('realisations').select('*').order('created_at', { ascending: false });
    if (!error) setRealisations(data || []);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  async function handleImageUpload(file) {
    if (!file) return '';
    const ext = file.name.split('.').pop();
    const fileName = `realisations/${Date.now()}-${Math.random().toString(36).substring(2,8)}.${ext}`;
    const { error } = await supabase.storage.from('realisations').upload(fileName, file);
    if (error) { alert(`Erreur: ${error.message}`); return ''; }
    const { data: publicUrlData } = supabase.storage.from('realisations').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let imageUrl = form.image;
    if (imageFile) imageUrl = await handleImageUpload(imageFile);
    
    const toSave = { ...form, image: imageUrl };
    if (editingId) {
      await supabase.from('realisations').update(toSave).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('realisations').insert([toSave]);
    }
    
    setForm({ title: '', client: '', description: '', result: '', image: '', status: 'published' });
    setImageFile(null);
    setImagePreview(null);
    setLoading(false);
    fetchRealisations();
  }

  async function handleDelete(id) {
    if (window.confirm('Supprimer cette réalisation ?')) {
      await supabase.from('realisations').delete().eq('id', id);
      fetchRealisations();
    }
  }

  function handleEdit(r) {
    setForm({ title: r.title, client: r.client, description: r.description, result: r.result, image: r.image, status: r.status });
    setImagePreview(r.image);
    setEditingId(r.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <span className="admin-page-icon"><FiBriefcase /></span>
        <div>
          <h2>Projets & Réalisations</h2>
          <p className="admin-page-desc">Mettez en avant vos succès et vos études de cas.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="admin-main-col">
          <div className="admin-card">
            <h3>{editingId ? 'Modifier le projet' : 'Nouvelle réalisation'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Titre du projet</label>
                  <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required placeholder="Ex: Irrigation Solaire à Louga" />
                </div>
                <div className="form-group">
                  <label>Client / Localité</label>
                  <input value={form.client} onChange={e=>setForm({...form, client:e.target.value})} placeholder="Ex: Groupement Féminin de Nioro" />
                </div>
              </div>

              <div className="form-group">
                <label>Description du projet</label>
                <textarea rows="4" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required placeholder="Détaillez la mise en œuvre..." />
              </div>

              <div className="form-group">
                <label>Résultats & Impact</label>
                <textarea rows="2" value={form.result} onChange={e=>setForm({...form, result:e.target.value})} placeholder="Ex: Augmentation du rendement de 30%..." />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-pro btn-primary" disabled={loading}>
                  {loading ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Publier le projet'}
                </button>
                {editingId && (
                  <button type="button" className="btn-pro btn-ghost" onClick={()=>{setEditingId(null); setForm({title:'', client:'', description:'', result:'', image:'', status: 'published'}); setImagePreview(null);}}>
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-card">
            <h4 style={{ marginBottom: '1rem' }}>Image de couverture</h4>
            <div 
              className="media-upload-pro" 
              onClick={() => document.getElementById('image-upload').click()}
              style={{ padding: '1.5rem' }}
            >
              <FiUploadCloud size={24} style={{ marginBottom: '8px', color: 'var(--primary)' }} />
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Changer l'image</p>
              <input type="file" id="image-upload" hidden accept="image/*" onChange={handleImageChange} />
            </div>
            {imagePreview && (
              <div className="media-preview-pro" style={{ height: '160px', marginTop: '1rem' }}>
                <img src={imagePreview} alt="Aperçu" />
              </div>
            )}

            <div className="form-group" style={{ marginTop: '2rem' }}>
              <label>Statut de publication</label>
              <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-list">
        <h3>Projets récents</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {realisations.map((r) => (
            <motion.div 
              key={r.id} 
              className="admin-card" 
              style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              layout
            >
              <div style={{ height: '180px', position: 'relative' }}>
                <img src={r.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ 
                  position: 'absolute', top: '10px', right: '10px',
                  background: r.status === 'published' ? 'var(--success)' : 'var(--warning)',
                  color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase'
                }}>
                  {r.status === 'published' ? <><FiCheck /> En ligne</> : <><FiX /> Brouillon</>}
                </div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{r.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--gray-500)' }}>{r.client}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                  <button onClick={() => handleEdit(r)} className="btn-pro btn-ghost" style={{ flex: 1, padding: '8px' }}><FiEdit2 /> Modifier</button>
                  <button onClick={() => handleDelete(r.id)} className="btn-pro btn-ghost btn-danger" style={{ padding: '8px' }}><FiTrash2 /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}