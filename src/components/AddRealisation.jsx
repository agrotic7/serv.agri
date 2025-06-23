import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AddRealisation = ({ onAdd }) => {
  const [form, setForm] = useState({ title: '', description: '' });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 5);
    setFiles(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Envoi...');
    let imageUrls = [];
    if (files.length > 0) {
      for (let file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const { data, error } = await supabase.storage.from('realisations').upload(fileName, file);
        if (error) {
          setStatus("Erreur upload image : " + error.message);
          return;
        }
        const { publicUrl } = supabase.storage.from('realisations').getPublicUrl(fileName).data;
        imageUrls.push(publicUrl);
      }
    }
    const { data, error } = await supabase
      .from('realisations')
      .insert([{ ...form, images: imageUrls }]);
    if (error) {
      setStatus("Erreur lors de l'ajout");
    } else {
      setStatus('Ajouté !');
      setForm({ title: '', description: '' });
      setFiles([]);
      if (onAdd) onAdd();
    }
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <form onSubmit={handleSubmit} style={{marginBottom: 30}}>
      <h2>Ajouter une réalisation</h2>
      <input
        name="title"
        placeholder="Titre"
        value={form.title}
        onChange={handleChange}
        required
      /><br />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      /><br />
      <input
        type="file"
        accept="image/*"
        multiple
        name="images"
        onChange={handleFileChange}
      />
      {files.length > 0 && (
        <div style={{display: 'flex', gap: 10, margin: '10px 0'}}>
          {files.map((file, idx) => (
            <img key={idx} src={URL.createObjectURL(file)} alt="Aperçu" style={{maxWidth: 120, borderRadius: 8}} />
          ))}
        </div>
      )}
      <button type="submit">Ajouter</button>
      {status && <div>{status}</div>}
    </form>
  );
};

export default AddRealisation; 