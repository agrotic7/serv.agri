import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const RealisationsList = () => {
  const [realisations, setRealisations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealisations = async () => {
      const { data, error } = await supabase
        .from('realisations')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setRealisations(data);
      setLoading(false);
    };
    fetchRealisations();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h2>Réalisations</h2>
      {realisations.map((item) => (
        <div key={item.id} style={{border: '1px solid #ccc', margin: 10, padding: 10}}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          {item.image_url && <img src={item.image_url} alt={item.title} style={{maxWidth: 200}} />}
          <div style={{fontSize: 12, color: '#888'}}>Réalisé le {new Date(item.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default RealisationsList; 