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
  const [form, setForm] = useState({ title: '', content: '', image: '' });
  const [status, setStatus] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
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
    setStatus('Envoi...');
    let imageUrl = form.image;
    try {
      if (imageFile) {
        imageUrl = await uploadImageToStorage(imageFile);
      }
      const { data, error } = await supabase
        .from('news')
        .insert([{ ...form, image: imageUrl }]);
      if (error) {
        setStatus("Erreur lors de l'ajout");
      } else {
        setStatus('Ajouté !');
        setForm({ title: '', content: '', image: '' });
        setImageFile(null);
        setImagePreview(null);
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
        onChange={handleImageChange}
      /><br />
      {imagePreview && <img src={imagePreview} alt="Aperçu" style={{maxWidth: 200}} />}<br />
      <button type="submit">Ajouter</button>
      {status && <div>{status}</div>}
    </form>
  );
};

export default AddNews; 