import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h2>Actualités</h2>
      {news.map((item) => (
        <div key={item.id} style={{border: '1px solid #ccc', margin: 10, padding: 10}}>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
          {item.image && <img src={item.image} alt={item.title} style={{maxWidth: 200}} />}
          <div style={{fontSize: 12, color: '#888'}}>Publié le {new Date(item.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default NewsList; 