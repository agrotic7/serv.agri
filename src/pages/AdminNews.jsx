import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';
import { motion } from 'framer-motion';

const CATEGORIES = [
  'Innovation',
  'Événements',
  'Partenariats',
  'Technologies',
  'Développement durable'
];

const STATUS = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'published', label: 'Publié' }
];

// Fonction d'upload d'image sur Supabase Storage (bucket 'news')
async function uploadImageToStorage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const { data, error } = await supabase.storage.from('news').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (error) throw error;
  // Récupérer l'URL publique
  const { data: publicUrlData, error: urlError } = supabase.storage.from('news').getPublicUrl(fileName);
  if (urlError) throw urlError;
  console.log("URL publique de l'image :", publicUrlData.publicUrl);
  return publicUrlData.publicUrl;
}

function AdminNews() {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    image: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft',
    featured: false
  });
  const [editingId, setEditingId] = useState(null);
  const [newsFilter, setNewsFilter] = useState('all');
  const [newsSearchTerm, setNewsSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Charger les actualités depuis Supabase
  const fetchNews = async () => {
    setLoading(true);
    let query = supabase.from('news').select('*').order('created_at', { ascending: false });
    const { data, error } = await query;
    if (!error) setNews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Veuillez remplir le titre et le contenu.');
      return;
    }
    setLoading(true);
    let imageUrl = formData.image;
    try {
      if (imageFile) {
        imageUrl = await uploadImageToStorage(imageFile);
      }
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('news')
          .update({ title: formData.title, content: formData.content, image_url: imageUrl })
          .eq('id', editingId);
        if (!error) {
          setEditingId(null);
          setFormData({
            title: '', date: '', image: '', excerpt: '', content: '', category: '', status: 'draft', featured: false
          });
          setImagePreview(null);
          setImageFile(null);
          setSuccessMsg('Actualité modifiée avec succès !');
          setShowSuccessOverlay(true);
          setTimeout(() => setShowSuccessOverlay(false), 2000);
          fetchNews();
        }
      } else {
        // Insert
        const { error } = await supabase
          .from('news')
          .insert([{ title: formData.title, content: formData.content, image_url: imageUrl }]);
        if (!error) {
          setFormData({
            title: '', date: '', image: '', excerpt: '', content: '', category: '', status: 'draft', featured: false
          });
          setImagePreview(null);
          setImageFile(null);
          setSuccessMsg('Actualité ajoutée avec succès !');
          setShowSuccessOverlay(true);
          setTimeout(() => setShowSuccessOverlay(false), 2000);
          fetchNews();
        }
      }
    } catch (err) {
      alert(err.message || "Erreur lors de l'upload de l'image.");
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || '',
      date: item.date || '',
      image: item.image || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      category: item.category || '',
      status: item.status || 'draft',
      featured: item.featured || false
    });
    setImagePreview(item.image || null);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      setLoading(true);
      await supabase.from('news').delete().eq('id', id);
      fetchNews();
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    await supabase.from('news').update({ status: newStatus }).eq('id', id);
    fetchNews();
    setLoading(false);
  };

  const filteredNews = news
    .filter(item => newsFilter === 'all' || item.status === newsFilter)
    .filter(item =>
      item.title?.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
      item.excerpt?.toLowerCase().includes(newsSearchTerm.toLowerCase())
    );

  // Toast de succès
  const SuccessToast = ({ message, show }) => (
    <div style={{
      position: 'fixed',
      top: 30,
      right: 30,
      zIndex: 10000,
      minWidth: 260,
      padding: '18px 32px',
      background: '#eaffea',
      color: '#207c2f',
      borderRadius: 12,
      boxShadow: '0 4px 24px rgba(46,125,50,0.12)',
      display: show ? 'flex' : 'none',
      alignItems: 'center',
      gap: 16,
      fontWeight: 600,
      fontSize: 18,
      transition: 'opacity 0.3s',
      animation: show ? 'slideInRight 0.5s' : 'none'
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#4BB543"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span>{message}</span>
    </div>
  );

  return (
    <div className="admin-section">
      {/* Toast de succès */}
      <SuccessToast message={successMsg} show={!!successMsg && showSuccessOverlay} />
      {/* Overlay animé */}
      {(loading || showSuccessOverlay) && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', transition: 'background 0.3s'
        }}>
          {loading && (
            <>
              <div className="loading-spinner" style={{width:60, height:60, border:'6px solid #f3f3f3', borderTop:'6px solid #007bff', borderRadius:'50%', animation:'spin 1s linear infinite', marginBottom: 20}}></div>
              <div style={{color:'#222', fontSize:22, fontWeight:600}}>Enregistrement en cours...</div>
            </>
          )}
          {showSuccessOverlay && !loading && (
            <>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="38" stroke="#4BB543" strokeWidth="4" fill="#eaffea" />
                <path d="M25 42L37 54L56 31" stroke="#4BB543" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                  <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="0.5s" fill="freeze" />
                </path>
              </svg>
              <div style={{color:'#4BB543', fontSize:22, fontWeight:700, marginTop:18}}>{successMsg}</div>
            </>
          )}
        </div>
      )}
      <div className="admin-form">
        <div className="form-header">
          <h2>{editingId ? 'Modifier l\'actualité' : 'Ajouter une nouvelle actualité'}</h2>
          <div className="form-status">
            <label>
              Statut:
              <select name="status" value={formData.status} onChange={handleInputChange}>
                {STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            <label>
              Mettre en avant:
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
            </label>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-main">
            <div className="form-group">
              <label htmlFor="news-title">Titre de l'actualité <span className="required">*</span></label>
              <input type="text" id="news-title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="news-date">Date <span className="required">*</span></label>
              <input type="date" id="news-date" name="date" value={formData.date} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="news-excerpt">Extrait <span className="required">*</span></label>
              <textarea id="news-excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} required rows="3"></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="news-content">Contenu complet <span className="required">*</span></label>
              <textarea id="news-content" name="content" value={formData.content} onChange={handleInputChange} required rows="10" className="content-editor"></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="news-category">Catégorie <span className="required">*</span></label>
              <select id="news-category" name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="">Sélectionner une catégorie</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-aside">
            <div className="form-group">
              <label htmlFor="news-image-upload" className="image-upload">
                {formData.image ? 'Changer l\'image' : 'Ajouter une image'}
                <input type="file" id="news-image-upload" className="image-input" onChange={handleImageChange} accept="image/*" />
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Aperçu" />
                </div>
              )}
            </div>
            {editingId && (
              <button type="button" onClick={() => {
                setEditingId(null);
                setFormData({
                  title: '', date: '', image: '', excerpt: '', content: '', category: '', status: 'draft', featured: false
                });
                setImagePreview(null);
              }} className="cancel-edit-btn">
                Annuler la modification
              </button>
            )}
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {editingId ? 'Modifier' : 'Ajouter'} Actualité
            </button>
          </div>
        </form>
      </div>

      <div className="admin-list">
        <h3>Liste des Actualités</h3>
        <div className="filter-buttons" style={{ marginBottom: '20px', justifyContent: 'flex-end' }}>
          <input
            type="text"
            placeholder="Rechercher par titre..."
            value={newsSearchTerm}
            onChange={e => setNewsSearchTerm(e.target.value)}
            className="search-box-inline"
          />
          <button onClick={() => setNewsFilter('all')} className={newsFilter === 'all' ? 'active' : ''}>Toutes</button>
          <button onClick={() => setNewsFilter('published')} className={newsFilter === 'published' ? 'active' : ''}>Publiées</button>
          <button onClick={() => setNewsFilter('draft')} className={newsFilter === 'draft' ? 'active' : ''}>Brouillons</button>
        </div>
        <div className="list-header">
          <div>Image</div>
          <div>Titre</div>
          <div>Date</div>
          <div>Statut</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>
        {filteredNews.length === 0 ? (
          <p className="no-items">Aucune actualité trouvée.</p>
        ) : (
          filteredNews.map((item, idx) => (
            <motion.div
              key={item.id}
              className="list-item"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <div className="item-image">
                {item.image && <img src={item.image} alt={item.title} />}
              </div>
              <div className="item-title">{item.title}</div>
              <div className="item-date">{item.date}</div>
              <div className="item-status">
                <span className={item.status === 'published' ? 'status-published' : 'status-draft'}>
                  {item.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(item)} className="edit-btn">Modifier</button>
                {item.status === 'draft' ? (
                  <button onClick={() => handleStatusChange(item.id, 'published')} className="publish-btn">Publier</button>
                ) : (
                  <button onClick={() => handleStatusChange(item.id, 'draft')} className="unpublish-btn">Dépublier</button>
                )}
                <button onClick={() => handleDelete(item.id)} className="delete-btn">Supprimer</button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminNews; 