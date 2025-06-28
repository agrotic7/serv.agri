import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';
import { motion } from 'framer-motion';

const STATUS = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'published', label: 'Publié' }
];

async function uploadImageToStorage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const { data, error } = await supabase.storage.from('realisations').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (error) throw error;
  // Récupérer l'URL publique
  const { data: publicUrlData } = supabase.storage.from('realisations').getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}

function AdminRealisations() {
  const [realisations, setRealisations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    medias: [],
    description: '',
    excerpt: '',
    fullContent: '',
    status: 'draft',
    featured: false
  });
  const [editingId, setEditingId] = useState(null);
  const [realisationFilter, setRealisationFilter] = useState('all');
  const [realisationSearchTerm, setRealisationSearchTerm] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  // Charger les réalisations depuis Supabase
  const fetchRealisations = async () => {
    setLoading(true);
    let query = supabase.from('realisations').select('*').order('created_at', { ascending: false });
    const { data, error } = await query;
    if (!error) setRealisations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRealisations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
    const previews = files.map(file => {
      if (file.type.startsWith('image/')) {
        return { type: 'image', url: URL.createObjectURL(file) };
      } else if (file.type.startsWith('video/')) {
        return { type: 'video', url: URL.createObjectURL(file) };
      }
      return null;
    }).filter(Boolean);
    setMediaPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!formData.title || !formData.date || !formData.description || !formData.excerpt || !formData.fullContent) {
      setErrorMsg('Veuillez remplir tous les champs requis.');
      return;
    }
    setLoading(true);
    let medias = formData.medias || [];
    try {
      if (mediaFiles.length > 0) {
        medias = [];
        for (let file of mediaFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
          const { data, error } = await supabase.storage.from('realisations').upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
          if (error) throw error;
          const { data: publicUrlData } = supabase.storage.from('realisations').getPublicUrl(fileName);
          medias.push({
            type: file.type.startsWith('image/') ? 'image' : 'video',
            url: publicUrlData.publicUrl
          });
        }
      }
      if (editingId) {
        const { error } = await supabase
          .from('realisations')
          .update({
            title: formData.title,
            date: formData.date,
            medias,
            description: formData.description,
            excerpt: formData.excerpt,
            fullContent: formData.fullContent,
            status: formData.status,
            featured: formData.featured
          })
          .eq('id', editingId);
        if (!error) {
          setEditingId(null);
          setFormData({
            title: '', date: '', medias: [], description: '', excerpt: '', fullContent: '', status: 'draft', featured: false
          });
          setMediaPreviews([]);
          setMediaFiles([]);
          setSuccessMsg('Réalisation modifiée avec succès !');
          setShowSuccessOverlay(true);
          setTimeout(() => setShowSuccessOverlay(false), 2000);
          fetchRealisations();
        } else {
          setErrorMsg(error.message || 'Erreur lors de la modification.');
        }
      } else {
        const { error } = await supabase
          .from('realisations')
          .insert([{ ...formData, medias, created_at: new Date().toISOString() }]);
        if (!error) {
          setFormData({
            title: '', date: '', medias: [], description: '', excerpt: '', fullContent: '', status: 'draft', featured: false
          });
          setMediaPreviews([]);
          setMediaFiles([]);
          setSuccessMsg('Réalisation ajoutée avec succès !');
          setShowSuccessOverlay(true);
          setTimeout(() => setShowSuccessOverlay(false), 2000);
          fetchRealisations();
        } else {
          setErrorMsg(error.message || 'Erreur lors de l\'ajout.');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de l\'upload des médias.');
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || '',
      date: item.date || '',
      medias: item.medias || [],
      description: item.description || '',
      excerpt: item.excerpt || '',
      fullContent: item.fullContent || '',
      status: item.status || 'draft',
      featured: item.featured || false
    });
    setMediaPreviews(item.medias.map(media => ({
      type: media.type,
      url: media.url
    })));
    setMediaFiles([]);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    setToDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    if (toDeleteId) {
      setLoading(true);
      await supabase.from('realisations').delete().eq('id', toDeleteId);
      fetchRealisations();
      setLoading(false);
      setToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setToDeleteId(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    await supabase.from('realisations').update({ status: newStatus }).eq('id', id);
    fetchRealisations();
    setLoading(false);
  };

  const filteredRealisations = realisations
    .filter(item => realisationFilter === 'all' || item.status === realisationFilter)
    .filter(item =>
      item.title?.toLowerCase().includes(realisationSearchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(realisationSearchTerm.toLowerCase())
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
          <h2>{editingId ? 'Modifier la réalisation' : 'Ajouter une nouvelle réalisation'}</h2>
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
              <label htmlFor="real-title">Titre de la réalisation <span className="required">*</span></label>
              <input type="text" id="real-title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="real-date">Date <span className="required">*</span></label>
              <input type="date" id="real-date" name="date" value={formData.date} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="real-excerpt">Extrait <span className="required">*</span></label>
              <textarea id="real-excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} required rows="3"></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="real-description">Description <span className="required">*</span></label>
              <textarea id="real-description" name="description" value={formData.description} onChange={handleInputChange} required rows="3"></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="real-fullContent">Contenu complet <span className="required">*</span></label>
              <textarea id="real-fullContent" name="fullContent" value={formData.fullContent} onChange={handleInputChange} required rows="10" className="content-editor"></textarea>
            </div>
          </div>
          <div className="form-aside">
            <div className="form-group">
              <label htmlFor="real-media-upload" className="image-upload">
                {mediaFiles.length > 0 ? 'Changer les médias' : 'Ajouter des images/vidéos'}
                <input
                  type="file"
                  id="real-media-upload"
                  className="image-input"
                  onChange={handleMediaChange}
                  accept="image/*,video/*"
                  multiple
                />
              </label>
              {mediaPreviews.length > 0 && (
                <div className="media-preview-list" style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
                  {mediaPreviews.map((media, idx) =>
                    media.type === 'image' ? (
                      <img key={idx} src={media.url} alt="Aperçu" style={{maxWidth:80,maxHeight:80,borderRadius:6}} />
                    ) : (
                      <video key={idx} src={media.url} style={{maxWidth:80,maxHeight:80,borderRadius:6}} controls />
                    )
                  )}
                </div>
              )}
            </div>
            {editingId && (
              <button type="button" onClick={() => {
                setEditingId(null);
                setFormData({
                  title: '', date: '', medias: [], description: '', excerpt: '', fullContent: '', status: 'draft', featured: false
                });
                setMediaPreviews([]);
                setMediaFiles([]);
              }} className="cancel-edit-btn">
                Annuler la modification
              </button>
            )}
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {editingId ? 'Modifier' : 'Ajouter'} Réalisation
            </button>
          </div>
        </form>
      </div>
      {/* Liste identique à actualités */}
      <div className="admin-list">
        <h3>Liste des Réalisations</h3>
        <div className="filter-buttons" style={{ marginBottom: '20px', justifyContent: 'flex-end' }}>
          <input
            type="text"
            placeholder="Rechercher par titre..."
            value={realisationSearchTerm}
            onChange={e => setRealisationSearchTerm(e.target.value)}
            className="search-box-inline"
          />
          <button onClick={() => setRealisationFilter('all')} className={realisationFilter === 'all' ? 'active' : ''}>Toutes</button>
          <button onClick={() => setRealisationFilter('published')} className={realisationFilter === 'published' ? 'active' : ''}>Publiées</button>
          <button onClick={() => setRealisationFilter('draft')} className={realisationFilter === 'draft' ? 'active' : ''}>Brouillons</button>
        </div>
        <div className="list-header">
          <div>Image</div>
          <div>Titre</div>
          <div>Date</div>
          <div>Statut</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>
        {filteredRealisations.length === 0 ? (
          <p className="no-items">Aucune réalisation trouvée.</p>
        ) : (
          filteredRealisations.map((item, idx) => (
            <motion.div
              key={item.id}
              className="list-item"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <div className="item-image">
                {(item.medias && item.medias.length > 0 && item.medias[0].type === 'image') && <img src={item.medias[0].url} alt={item.title} />}
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

export default AdminRealisations; 