import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AddRealisation = ({ onAdd }) => {
  const [form, setForm] = useState({ title: '', description: '', image_url: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Envoi...');
    const { data, error } = await supabase
      .from('realisations')
      .insert([form]);
    if (error) {
      setStatus("Erreur lors de l'ajout");
    } else {
      setStatus('Ajouté !');
      setForm({ title: '', description: '', image_url: '' });
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
        name="image_url"
        placeholder="URL de l'image (optionnel)"
        value={form.image_url}
        onChange={handleChange}
      /><br />
      <button type="submit">Ajouter</button>
      {status && <div>{status}</div>}
    </form>
  );
};

export default AddRealisation; 