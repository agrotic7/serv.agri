import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [form, setForm] = useState({ name: '', logo: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => { fetchPartners(); }, []);

  async function fetchPartners() {
    const { data } = await supabase.from('partners').select('*').order('id', { ascending: true });
    setPartners(data || []);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
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
    setLoading(false);
    fetchPartners();
  }

  async function deleteLogoFromUrl(url) {
    if (!url) return;
    const match = url.match(/partners\/([^?]+)/);
    if (match && match[1]) {
      await supabase.storage.from('partners').remove([match[1]]);
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Supprimer ce partenaire ?')) {
      const p = partners.find(x => x.id === id);
      await deleteLogoFromUrl(p.logo);
      await supabase.from('partners').delete().eq('id', id);
      fetchPartners();
    }
  }

  function handleEdit(p) {
    setForm({ name: p.name, logo: p.logo });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="admin-section">
      <h2>Gérer les Partenaires / Clients</h2>
      <form onSubmit={handleSubmit} className="admin-form" style={{marginBottom:32}}>
        <div className="form-grid">
          <div className="form-main">
            <div className="form-group">
              <label>Nom du partenaire</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Logo (upload)</label>
              <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} />
              {form.logo && <img src={form.logo} alt="aperçu" style={{maxWidth:100,marginTop:8}} />}
            </div>
          </div>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>{editingId ? 'Modifier' : 'Ajouter'} le partenaire</button>
        {editingId && <button type="button" onClick={()=>{setEditingId(null);setForm({ name: '', logo: '' });}} style={{marginLeft:12}}>Annuler</button>}
      </form>
      <div className="partners-grid-admin" style={{display:'flex',flexWrap:'wrap',gap:24}}>
        {partners.map((p, i) => (
          <div key={p.id} className="partner-card-admin" style={{border:'1px solid #e0e0e0',borderRadius:12,padding:16,minWidth:180,display:'flex',flexDirection:'column',alignItems:'center',position:'relative'}}>
            <img src={p.logo} alt={p.name} style={{maxWidth:100,maxHeight:60,objectFit:'contain',marginBottom:8}} />
            <div style={{fontWeight:500,marginBottom:8}}>{p.name}</div>
            <div style={{position:'absolute',top:8,right:8,display:'flex',gap:8}}>
              <button onClick={()=>handleEdit(p)} style={{background:'#e3f2fd',border:'none',borderRadius:6,padding:'2px 10px',cursor:'pointer'}}>Modifier</button>
              <button onClick={()=>handleDelete(p.id)} style={{background:'#ffebee',border:'none',borderRadius:6,padding:'2px 10px',color:'#c62828',cursor:'pointer'}}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 