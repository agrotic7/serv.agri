import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';

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
    image: '',
    description: '',
    excerpt: '',
    fullContent: '',
    status: 'draft',
    featured: false
  });
  const [editingId, setEditingId] = useState(null);
  const [realisationFilter, setRealisationFilter] = useState('all');
  const [realisationSearchTerm, setRealisationSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [imageFile, setImageFile] = useState(null);
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
    setErrorMsg('');
    setSuccessMsg('');
    if (!formData.title || !formData.date || !formData.description || !formData.excerpt || !formData.fullContent) {
      setErrorMsg('Veuillez remplir tous les champs requis.');
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
        console.log('FormData envoyé à Supabase:', formData);
        const { error } = await supabase
          .from('realisations')
          .update({
            title: formData.title,
            date: formData.date,
            image: imageUrl,
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
            title: '', date: '', image: '', description: '', excerpt: '', fullContent: '', status: 'draft', featured: false
          });
          setImagePreview(null);
          setImageFile(null);
          setSuccessMsg('Réalisation modifiée avec succès !');
          setShowSuccessOverlay(true);
          setTimeout(() => setShowSuccessOverlay(false), 2000);
          fetchRealisations();
        } else {
          setErrorMsg(error.message || 'Erreur lors de la modification.');
    }
      } else {
        // Insert
        console.log('FormData envoyé à Supabase:', formData);
        const { error } = await supabase
          .from('realisations')
          .insert([{ ...formData, image: imageUrl, created_at: new Date().toISOString() }]);
        if (!error) {
          setFormData({
            title: '', date: '', image: '', description: '', excerpt: '', fullContent: '', status: 'draft', featured: false
      });
          setImagePreview(null);
          setImageFile(null);
          setSuccessMsg('Réalisation ajoutée avec succès !');
          setShowSuccessOverlay(true);
          setTimeout(() => setShowSuccessOverlay(false), 2000);
          fetchRealisations();
        } else {
          setErrorMsg(error.message || 'Erreur lors de l\'ajout.');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors de l\'upload de l\'image.');
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || '',
      date: item.date || '',
      image: item.image || '',
      description: item.description || '',
      excerpt: item.excerpt || '',
      fullContent: item.fullContent || '',
      status: item.status || 'draft',
      featured: item.featured || false
    });
    setImagePreview(item.image || null);
    setImageFile(null);
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
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:10001,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:16,padding:'32px 40px',boxShadow:'0 8px 32px rgba(0,0,0,0.18)',textAlign:'center',minWidth:320}}>
            <div style={{fontSize:22,fontWeight:700,marginBottom:18}}>Confirmer la suppression</div>
            <div style={{fontSize:16,marginBottom:28}}>Voulez-vous vraiment supprimer cette réalisation ? Cette action est <b>irréversible</b>.</div>
            <div style={{display:'flex',gap:18,justifyContent:'center'}}>
              <button onClick={confirmDelete} style={{background:'#dc3545',color:'#fff',padding:'10px 28px',borderRadius:8,fontWeight:600,border:'none',fontSize:16,cursor:'pointer'}}>Supprimer</button>
              <button onClick={cancelDelete} style={{background:'#f0f0f0',color:'#333',padding:'10px 28px',borderRadius:8,fontWeight:600,border:'none',fontSize:16,cursor:'pointer'}}>Annuler</button>
            </div>
          </div>
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
          {errorMsg && <div style={{color:'red',marginBottom:10}}>{errorMsg}</div>}
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
              <label htmlFor="real-description">Description <span className="required">*</span></label>
              <textarea id="real-description" name="description" value={formData.description} onChange={handleInputChange} required rows="3"></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="real-excerpt">Extrait <span className="required">*</span></label>
              <textarea id="real-excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} required rows="3"></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="real-fullContent">Contenu complet <span className="required">*</span></label>
              <textarea id="real-fullContent" name="fullContent" value={formData.fullContent} onChange={handleInputChange} required rows="10" className="content-editor"></textarea>
            </div>
          </div>
          <div className="form-aside">
            <div className="form-group">
              <label htmlFor="real-image-upload" className="image-upload">
                {formData.image ? 'Changer l\'image' : 'Ajouter une image'}
                <input type="file" id="real-image-upload" className="image-input" onChange={handleImageChange} accept="image/*" />
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
                  title: '', date: '', image: '', description: '', excerpt: '', fullContent: '', status: 'draft', featured: false
                });
                setImagePreview(null);
                setImageFile(null);
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
          <div className="no-items" style={{textAlign:'center',padding:'60px 0',color:'#aaa',fontSize:18}}>
            <svg width="60" height="60" fill="none" viewBox="0 0 60 60" style={{marginBottom:18}}><circle cx="30" cy="30" r="28" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="2"/><path d="M20 38c2-2 6-6 10-6s8 4 10 6" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round"/><circle cx="24" cy="26" r="2" fill="#bdbdbd"/><circle cx="36" cy="26" r="2" fill="#bdbdbd"/></svg>
            Aucune réalisation pour le moment.<br/>Ajoutez-en une pour commencer !
          </div>
        ) : (
          filteredRealisations.map(item => (
            <div key={item.id} className="list-item">
              <div className="item-image">
                {item.image_url && <img src={item.image_url} alt={item.title} />}
              </div>
              <div className="item-title">{item.title}</div>
              <div className="item-date">{item.date}</div>
              <div className="item-status">
                {item.status === 'published' ? (
                  <span style={{background:'#eaffea',color:'#207c2f',padding:'6px 18px',borderRadius:16,fontWeight:700,fontSize:14,boxShadow:'0 2px 8px rgba(46,125,50,0.06)'}}>Publié</span>
                ) : (
                  <span style={{background:'#fffbe6',color:'#bfa100',padding:'6px 18px',borderRadius:16,fontWeight:700,fontSize:14,boxShadow:'0 2px 8px rgba(191,161,0,0.06)'}}>Brouillon</span>
                )}
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(item)} className="edit-btn" aria-label="Modifier la réalisation">Modifier</button>
                {item.status === 'draft' ? (
                  <button onClick={() => handleStatusChange(item.id, 'published')} className="publish-btn" aria-label="Publier la réalisation">Publier</button>
                ) : (
                  <button onClick={() => handleStatusChange(item.id, 'draft')} className="unpublish-btn" aria-label="Dépublier la réalisation">Dépublier</button>
                )}
                <button onClick={() => handleDelete(item.id)} className="delete-btn" aria-label="Supprimer la réalisation">Supprimer</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminRealisations; 