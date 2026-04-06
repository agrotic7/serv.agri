import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

async function uploadImageToStorage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const { data, error } = await supabase.storage.from('news').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (error) throw error;
  const { data: publicUrlData } = supabase.storage.from('news').getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}

const AddNews = ({ onAdd }) => {
  const [form, setForm] = useState({ title: '', content: '' });
  const [status, setStatus] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImageFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Envoi...');
    let imageUrls = [];
    try {
      if (imageFiles.length > 0) {
        for (let file of imageFiles) {
          const url = await uploadImageToStorage(file);
          imageUrls.push(url);
        }
      }
      const { data, error } = await supabase
        .from('news')
        .insert([{ ...form, images: imageUrls }]);
      if (error) {
        setStatus("Erreur lors de l'ajout");
      } else {
        setStatus('Ajouté !');
        setForm({ title: '', content: '' });
        setImageFiles([]);
        setImagePreviews([]);
        if (onAdd) onAdd();
      }
    } catch (err) {
      setStatus(err.message || "Erreur lors de l'upload de l'image.");
    }
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <form onSubmit={handleSubmit} style={{marginBottom: 30}}>
      <h2>Ajouter une actualité</h2>
      <input
        name="title"
        placeholder="Titre"
        value={form.title}
        onChange={handleChange}
        required
      /><br />
      <textarea
        name="content"
        placeholder="Contenu"
        value={form.content}
        onChange={handleChange}
        required
      /><br />
      <input
        type="file"
        accept="image/*"
        multiple
        name="images"
        onChange={handleImageChange}
      /><br />
      {imageFiles.length > 0 && (
        <div style={{display: 'flex', gap: 10, margin: '10px 0'}}>
          {imageFiles.map((file, idx) => (
            <img key={idx} src={URL.createObjectURL(file)} alt="Aperçu" style={{maxWidth: 120, borderRadius: 8}} />
          ))}
        </div>
      )}
      <button type="submit">Ajouter</button>
      {status && <div>{status}</div>}
    </form>
  );
};

export default AddNews; 