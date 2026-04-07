import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';
import { FiFileText, FiPlus, FiTrash2, FiEdit2, FiUploadCloud, FiCheck, FiX, FiCalendar, FiTag, FiSearch, FiSend } from 'react-icons/fi';
import './Admin.css';

const CATEGORIES = [
  'Innovation',
  'Événements',
  'Partenariats',
  'Technologies',
  'Développement durable'
];

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({
    title: '', date: '', image_url: '', excerpt: '', content: '', category: '', status: 'draft', featured: false
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (!error) setNews(data || []);
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const ext = file.name.split('.').pop();
    const fileName = `news/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('news').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('news').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.image_url;
      if (imageFile) imageUrl = await uploadImage(imageFile);
      
      const payload = { ...formData, image_url: imageUrl };
      
      if (editingId) {
        await supabase.from('news').update(payload).eq('id', editingId);
      } else {
        await supabase.from('news').insert([payload]);
      }
      
      resetForm();
      fetchNews();
    } catch (err) {
      alert("Erreur lors de l'enregistrement : " + err.message);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ title: '', date: '', image_url: '', excerpt: '', content: '', category: '', status: 'draft', featured: false });
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || '',
      date: item.date || '',
      image_url: item.image_url || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      category: item.category || '',
      status: item.status || 'draft',
      featured: item.featured || false
    });
    setImagePreview(item.image_url || null);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette actualité définitivement ?')) {
      await supabase.from('news').delete().eq('id', id);
      fetchNews();
    }
  };

  const filteredNews = news
    .filter(item => filter === 'all' || item.status === filter)
    .filter(item => item.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <span className="admin-page-icon"><FiFileText /></span>
        <div>
          <h2>Articles & Actualités</h2>
          <p className="admin-page-desc">Publiez des articles pour informer votre communauté.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="admin-main-col">
          <div className="admin-card">
            <h3>{editingId ? 'Modifier l\'article' : 'Rédiger une actualité'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Titre de l'article</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                  placeholder="Ex: Servagri lance sa nouvelle sonde connectée"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label><FiCalendar /> Date de publication</label>
                  <input 
                    type="date" 
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label><FiTag /> Catégorie</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Extrait / Résumé (pour les listes)</label>
                <textarea 
                  rows="2" 
                  value={formData.excerpt} 
                  onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                  required 
                  placeholder="Bref résumé de l'article..."
                />
              </div>

              <div className="form-group">
                <label>Contenu complet</label>
                <Editor
                  id="news-editor"
                  tinymceScriptSrc="/tinymce/tinymce.min.js"
                  value={formData.content}
                  onEditorChange={content => setFormData({...formData, content})}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'],
                    toolbar: 'undo redo | blocks | bold italic underline | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | removeformat | help',
                    content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:16px }'
                  }}
                />
              </div>

              <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                <button type="submit" className="btn-pro btn-primary" disabled={loading}>
                  {loading ? 'Traitement...' : editingId ? 'Mettre à jour' : 'Publier l\'article'}
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
            <h4 style={{ marginBottom: '1rem' }}>Image de mise en avant</h4>
            <div 
              className="media-upload-pro" 
              onClick={() => document.getElementById('image-upload').click()}
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

            <div className="form-group" style={{ marginTop: '2.5rem' }}>
              <label>Statut</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                id="featured" 
                checked={formData.featured} 
                onChange={e => setFormData({...formData, featured: e.target.checked})}
                style={{ width: 'auto' }}
              />
              <label htmlFor="featured" style={{ margin: 0 }}>Mettre en avant</label>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-list">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Articles existants</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="admin-card" style={{ padding: '0.5rem 1rem', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiSearch color="var(--gray-400)" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--gray-300)' }}
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <AnimatePresence>
            {filteredNews.map((item, idx) => (
              <motion.div 
                key={item.id} 
                className="list-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="item-img" style={{ width: '80px', height: '60px' }}>
                  <img src={item.image_url} alt="" />
                </div>
                <div className="item-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4>{item.title}</h4>
                    {item.featured && <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>PIN</span>}
                  </div>
                  <p>{item.category} • {new Date(item.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div style={{ 
                  padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                  background: item.status === 'published' ? 'var(--success)' : 'var(--gray-200)',
                  color: item.status === 'published' ? '#fff' : 'var(--gray-500)'
                }}>
                  {item.status.toUpperCase()}
                </div>
                <div className="item-actions">
                  <button onClick={() => handleEdit(item)} className="btn-pro btn-ghost"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(item.id)} className="btn-pro btn-ghost btn-danger"><FiTrash2 /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}