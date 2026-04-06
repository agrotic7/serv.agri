import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce';
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default/icons';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/help';
import 'tinymce/plugins/wordcount';

function AdminNewsletter() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [subCount, setSubCount] = useState(0);

  useEffect(() => {
    // Récupérer le nombre d'inscrits
    const fetchCount = async () => {
      const { count } = await supabase.from('newsletter').select('*', { count: 'exact', head: true });
      setSubCount(count || 0);
    };
    fetchCount();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!title || !content) {
      setMessage('Veuillez remplir le titre et le contenu.');
      return;
    }
    setLoading(true);
    // Récupérer tous les emails inscrits
    const { data, error } = await supabase.from('newsletter').select('email');
    setLoading(false);
    if (error) {
      setMessage("Erreur lors de la récupération des emails.");
      return;
    }
    const emails = data.map(e => e.email);
    setMessage('Newsletter envoyée (démo).');
    setTitle('');
    setContent('');
    alert(`Newsletter envoyée à :\n${emails.join(', ')}`);
    // TODO: Enregistrer la newsletter envoyée dans une table 'newsletters' sur Supabase
    // TODO: Intégrer un service d'emailing pour l'envoi réel
  };

  return (
    <div style={{minHeight:'100vh', background:'#f6fbf7', padding:'2.5rem 0'}}>
      <div style={{maxWidth:600, margin:'2rem auto', background:'#fff', borderRadius:18, boxShadow:'0 4px 32px #e0e0e0', padding:'2.5rem 2rem', position:'relative'}}>
        <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:24}}>
          <span style={{fontSize:32, color:'#4bbf73', background:'#e6f2ea', borderRadius:'50%', width:48, height:48, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <i className="fas fa-paper-plane"></i>
          </span>
          <div>
            <h2 style={{margin:0, fontWeight:700, fontSize:'1.7rem', color:'#184c32'}}>Envoyer une Newsletter</h2>
            <div style={{fontSize:'1rem', color:'#4bbf73', fontWeight:500}}>{subCount} inscrit{subCount>1?'s':''} à la newsletter</div>
          </div>
        </div>
        <form onSubmit={handleSend} style={{display:'flex', flexDirection:'column', gap:'1.2rem'}}>
          <label style={{fontWeight:600, color:'#184c32'}}>Titre</label>
          <input type="text" placeholder="Titre de la newsletter" value={title} onChange={e=>setTitle(e.target.value)} style={{padding:'0.7rem 1rem', fontSize:'1.1rem', borderRadius:8, border:'1px solid #c8d7c1', marginBottom:8}} />
          <label style={{fontWeight:600, color:'#184c32'}}>Contenu</label>
          <Editor
            value={content}
            onEditorChange={setContent}
            init={{
              height: 260,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview', 'anchor',
                'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
              ],
              toolbar:
                'undo redo | formatselect | bold italic underline | bullist numlist | link | removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
            }}
          />
          <button type="submit" disabled={loading} style={{background:'#4bbf73', color:'#fff', border:'none', borderRadius:8, fontWeight:600, fontSize:'1.1rem', padding:'0.8rem 0', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>
            <i className="fas fa-paper-plane"></i>
            {loading ? 'Envoi...' : 'Envoyer à tous les inscrits'}
          </button>
          {message && <div style={{background: message.includes('envoyée') ? '#eaffea' : '#ffeaea', color: message.includes('envoyée') ? '#207c2f' : '#c0392b', borderRadius:8, padding:'0.7rem 1rem', fontWeight:500, fontSize:'1.05rem', marginTop:4}}>{message}</div>}
        </form>
        {/* TODO: Liste des newsletters envoyées ici (à brancher sur Supabase) */}
      </div>
    </div>
  );
}

export default AdminNewsletter; 