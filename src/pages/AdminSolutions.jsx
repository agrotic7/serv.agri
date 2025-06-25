import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiCheckCircle, FiTrendingUp, FiUsers, FiDroplet, FiBarChart2, FiCpu } from 'react-icons/fi';
import './Services.css';

const ICONS = {
  FiCheckCircle: <FiCheckCircle />, FiTrendingUp: <FiTrendingUp />, FiUsers: <FiUsers />, FiDroplet: <FiDroplet />, FiBarChart2: <FiBarChart2 />, FiCpu: <FiCpu />
};

export default function AdminSolutions() {
  const [solutions, setSolutions] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', img: '', video: '', badge: '', badgeClass: '', isNew: false, icon: 'FiCheckCircle'
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    fetchSolutions();
  }, []);

  async function fetchSolutions() {
    const { data } = await supabase.from('solutions').select('*').order('id', { ascending: true });
    setSolutions(data || []);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleFileUpload(file, type) {
    if (!file) return '';
    const ext = file.name.split('.').pop();
    const fileName = `${type}/${Date.now()}-${Math.random().toString(36).substring(2,8)}.${ext}`;
    const { error } = await supabase.storage.from('solutions').upload(fileName, file, { upsert: false });
    if (error) { alert(`Erreur upload ${type}: ${error.message}`); return ''; }
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
    const toSave = {
      title: form.title,
      description: form.description,
      img: imgUrl,
      video: videoUrl,
      badge: form.badge,
      badgeclass: form.badgeClass,
      isnew: form.isNew,
      icon: form.icon
    };
    if (editingId) {
      await supabase.from('solutions').update(toSave).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('solutions').insert([toSave]);
    }
    setForm({ title: '', description: '', img: '', video: '', badge: '', badgeClass: '', isNew: false, icon: 'FiCheckCircle' });
    setImageFile(null); setVideoFile(null);
    setLoading(false);
    fetchSolutions();
  }

  async function deleteFileFromUrl(url) {
    if (!url) return;
    // Extrait le chemin relatif après le nom du bucket
    const match = url.match(/solutions\/([^?]+)/);
    if (match && match[1]) {
      await supabase.storage.from('solutions').remove([match[1]]);
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Supprimer cette solution ?')) {
      const sol = solutions.find(s => s.id === id);
      await deleteFileFromUrl(sol.img);
      await deleteFileFromUrl(sol.video);
      await supabase.from('solutions').delete().eq('id', id);
      fetchSolutions();
    }
  }

  function handleEdit(sol) {
    setForm({ ...sol });
    setEditingId(sol.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="admin-section">
      <h2>Gérer les Solutions (Services)</h2>
      <form onSubmit={handleSubmit} className="admin-form" style={{marginBottom:32}}>
        <div className="form-grid">
          <div className="form-main">
            <div className="form-group">
              <label>Titre</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={3} />
            </div>
            <div className="form-group">
              <label>Image (upload)</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              {form.img && <img src={form.img} alt="aperçu" style={{maxWidth:100,marginTop:8}} />}
            </div>
            <div className="form-group">
              <label>Vidéo (upload)</label>
              <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} />
              {form.video && <video src={form.video} controls style={{maxWidth:120,marginTop:8}} />}
            </div>
            <div className="form-group">
              <label>Badge</label>
              <input name="badge" value={form.badge} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Classe du badge</label>
              <input name="badgeClass" value={form.badgeClass} onChange={handleChange} placeholder="badge-green, badge-blue..." />
            </div>
            <div className="form-group">
              <label>Icône</label>
              <select name="icon" value={form.icon} onChange={handleChange}>
                {Object.keys(ICONS).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label><input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} /> Nouveau</label>
            </div>
          </div>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>{editingId ? 'Modifier' : 'Ajouter'} la solution</button>
        {editingId && <button type="button" onClick={()=>{setEditingId(null);setForm({ title: '', description: '', img: '', video: '', badge: '', badgeClass: '', isNew: false, icon: 'FiCheckCircle' });}} style={{marginLeft:12}}>Annuler</button>}
      </form>
      <div className="services-grid-refonte">
        {solutions.map((s, i) => (
          <div className="service-card-refonte" key={s.id} style={{position:'relative'}}>
            <div className="service-img-refonte">
              {s.video ? (
                <video className="service-video-refonte" preload="auto" autoPlay loop muted playsInline poster={s.img}>
                  <source src={s.video.replace('.mp4', '.webm')} type="video/webm" />
                  <source src={s.video} type="video/mp4" />
                  Votre navigateur ne supporte pas la vidéo HTML5.
                </video>
              ) : (
                <img src={s.img} alt={s.title} />
              )}
              <div className="service-img-overlay" />
            </div>
            <div className="service-icon-refonte">{ICONS[s.icon] || <FiCheckCircle />}</div>
            {s.badge && <div className={`service-badge ${s.badgeClass}`}>{s.badge}</div>}
            {s.isNew && <span className="service-badge-nouveau">Nouveau</span>}
            <h3>{s.title}</h3>
            <p>{s.description}</p>
            <div style={{position:'absolute',top:8,right:8,display:'flex',gap:8}}>
              <button onClick={()=>handleEdit(s)} style={{background:'#e3f2fd',border:'none',borderRadius:6,padding:'2px 10px',cursor:'pointer'}}>Modifier</button>
              <button onClick={()=>handleDelete(s.id)} style={{background:'#ffebee',border:'none',borderRadius:6,padding:'2px 10px',color:'#c62828',cursor:'pointer'}}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 