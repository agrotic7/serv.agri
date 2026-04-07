import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiPlus, FiTrash2, FiEdit2, FiUploadCloud, FiCheckCircle, FiTrendingUp, FiUsers, FiDroplet, FiBarChart2, FiCpu, FiStar } from 'react-icons/fi';
import './Admin.css';

const ICONS = {
  FiCheckCircle: <FiCheckCircle />, 
  FiTrendingUp: <FiTrendingUp />, 
  FiUsers: <FiUsers />, 
  FiDroplet: <FiDroplet />, 
  FiBarChart2: <FiBarChart2 />, 
  FiCpu: <FiCpu />,
  FiZap: <FiZap />,
  FiStar: <FiStar />
};

export default function AdminSolutions() {
  const [solutions, setSolutions] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', img: '', video: '', badge: '', badgeclass: '', isnew: false, icon: 'FiZap'
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [previews, setPreviews] = useState({ img: null, video: null });

  useEffect(() => { fetchSolutions(); }, []);

  async function fetchSolutions() {
    const { data, error } = await supabase.from('solutions').select('*').order('id', { ascending: true });
    if (!error) setSolutions(data || []);
  }

  function handleFileChange(e, type) {
    const file = e.target.files[0];
    if (file) {
      if (type === 'img') {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviews(prev => ({ ...prev, img: reader.result }));
        reader.readAsDataURL(file);
      } else {
        setVideoFile(file);
        setPreviews(prev => ({ ...prev, video: URL.createObjectURL(file) }));
      }
    }
  }

  async function handleFileUpload(file, bucketPath) {
    if (!file) return '';
    const ext = file.name.split('.').pop();
    const fileName = `${bucketPath}/${Date.now()}-${Math.random().toString(36).substring(2,8)}.${ext}`;
    const { error } = await supabase.storage.from('solutions').upload(fileName, file);
    if (error) { alert(`Erreur upload: ${error.message}`); return ''; }
    const { data: publicUrlData } = supabase.storage.from('solutions').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let imgUrl = form.img;
    let videoUrl = form.video;
    if (imageFile) imgUrl = await handleFileUpload(imageFile, 'images');
    if (videoFile) videoUrl = await handleFileUpload(videoFile, 'videos');
    
    const toSave = { ...form, img: imgUrl, video: videoUrl };
    if (editingId) {
      await supabase.from('solutions').update(toSave).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('solutions').insert([toSave]);
    }
    
    resetForm();
    setLoading(false);
    fetchSolutions();
  }

  function resetForm() {
    setForm({ title: '', description: '', img: '', video: '', badge: '', badgeclass: '', isnew: false, icon: 'FiZap' });
    setImageFile(null); setVideoFile(null);
    setPreviews({ img: null, video: null });
    setEditingId(null);
  }

  async function handleDelete(id) {
    if (window.confirm('Supprimer cette solution de façon définitive ?')) {
      await supabase.from('solutions').delete().eq('id', id);
      fetchSolutions();
    }
  }

  function handleEdit(sol) {
    setForm({ ...sol });
    setPreviews({ img: sol.img, video: sol.video });
    setEditingId(sol.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <span className="admin-page-icon"><FiZap /></span>
        <div>
          <h2>Solutions & Services</h2>
          <p className="admin-page-desc">Configurez vos offres technologiques et agronomiques.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="admin-main-col">
          <div className="admin-card">
            <h3>{editingId ? 'Modifier la solution' : 'Ajouter une solution'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Titre de la solution</label>
                <input name="title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required placeholder="Ex: Irrigation Connectée" />
              </div>

              <div className="form-group">
                <label>Description détaillée</label>
                <textarea name="description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required rows={4} placeholder="Décrivez les bénéfices pour l'agriculteur..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Icône représentative</label>
                  <select name="icon" value={form.icon} onChange={e=>setForm({...form, icon:e.target.value})}>
                    {Object.keys(ICONS).map(k => <option key={k} value={k}>{k.replace('Fi', '')}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Badge de mise en avant (Optionnel)</label>
                  <input name="badge" value={form.badge} onChange={e=>setForm({...form, badge:e.target.value})} placeholder="Ex: Économe" />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="isnew" style={{ width: 'auto' }} checked={form.isnew} onChange={e=>setForm({...form, isnew:e.target.checked})} />
                <label htmlFor="isnew" style={{ margin: 0 }}>Marquer comme "Nouveau" (Affiche un badge spécial)</label>
              </div>

              <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                <button type="submit" className="btn-pro btn-primary" disabled={loading}>
                  {editingId ? <FiEdit2 /> : <FiPlus />} {loading ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer la solution'}
                </button>
                {editingId && (
                  <button type="button" className="btn-pro btn-ghost" onClick={resetForm}>Annuler</button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="admin-side-col">
          <div className="admin-card">
            <h4 style={{ marginBottom: '1.5rem' }}>Médias visuels</h4>
            
            <div className="form-group">
              <label>Image de fond</label>
              <div className="media-upload-pro" onClick={() => document.getElementById('img-upload').click()}>
                <FiUploadCloud size={20} />
                <span>Uploader Image</span>
                <input type="file" id="img-upload" hidden accept="image/*" onChange={e => handleFileChange(e, 'img')} />
              </div>
              {previews.img && (
                <div className="media-preview-pro" style={{ height: '120px', marginTop: '10px' }}>
                  <img src={previews.img} alt="" />
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Vidéo d'illustration</label>
              <div className="media-upload-pro" onClick={() => document.getElementById('vid-upload').click()}>
                <FiUploadCloud size={20} />
                <span>Uploader Vidéo</span>
                <input type="file" id="vid-upload" hidden accept="video/*" onChange={e => handleFileChange(e, 'vid')} />
              </div>
              {previews.video && (
                <div className="media-preview-pro" style={{ height: '120px', marginTop: '10px' }}>
                  <video src={previews.video} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-list">
        <h3>Solutions publiées</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <AnimatePresence>
            {solutions.map((s, idx) => (
              <motion.div 
                key={s.id} 
                className="admin-card" 
                style={{ padding: '0', overflow: 'hidden' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div style={{ padding: '1.5rem', display: 'flex', gap: '15px' }}>
                  <div style={{ 
                    width: '50px', height: '50px', background: 'var(--primary-light)', color: 'var(--primary)', 
                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' 
                  }}>
                    {ICONS[s.icon] || <FiCheckCircle />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{s.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--gray-500)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {s.description}
                    </p>
                  </div>
                </div>
                <div style={{ padding: '1rem', borderTop: '1px solid var(--gray-200)', background: 'var(--gray-100)', display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleEdit(s)} className="btn-pro btn-ghost" style={{ flex: 1, padding: '7px' }}><FiEdit2 /> Modifier</button>
                  <button onClick={() => handleDelete(s.id)} className="btn-pro btn-ghost btn-danger" style={{ padding: '7px' }}><FiTrash2 /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}