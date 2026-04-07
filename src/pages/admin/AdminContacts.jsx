import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInbox, FiTrash2, FiEye, FiMail, FiMessageSquare, FiAlertCircle, FiClock, FiUser } from 'react-icons/fi';
import './Admin.css';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleView = (contact) => { setSelected(contact); setShowModal(true); };
  
  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce message définitivement ?')) {
      await supabase.from('contacts').delete().eq('id', id);
      fetchContacts();
      if (selected?.id === id) setShowModal(false);
    }
  };

  const filtered = contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <span className="admin-page-icon"><FiMessageSquare /></span>
        <div>
          <h2>Boîte de réception</h2>
          <p className="admin-page-desc">Gérez les demandes de contact et messages clients.</p>
        </div>
      </div>

      <div className="admin-card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '0.5rem' }}>
          <FiInbox style={{ color: 'var(--gray-400)' }} />
          <input
            type="text"
            placeholder="Rechercher un message par nom, email ou objet..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', width: '100%', fontSize: '1rem', outline: 'none', background: 'transparent' }}
          />
          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
            {filtered.length} message{filtered.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="admin-list">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '4rem' }}>
            <FiInbox size={48} style={{ color: 'var(--gray-300)', marginBottom: '1rem' }} />
            <h4 style={{ color: 'var(--gray-700)' }}>Aucun message</h4>
            <p style={{ color: 'var(--gray-500)' }}>Votre boîte de réception est vide.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            <AnimatePresence>
              {filtered.map((contact, idx) => (
                <motion.div
                  key={contact.id}
                  className="list-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => handleView(contact)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gray-200)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)' 
                  }}>
                    <FiUser />
                  </div>
                  <div className="item-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4>{contact.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiClock /> {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p style={{ fontWeight: 600, color: 'var(--gray-700)', fontSize: '0.9rem', marginTop: '2px' }}>{contact.subject}</p>
                    <p style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '600px' }}>
                      {contact.message}
                    </p>
                  </div>
                  <div className="item-actions" onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleDelete(contact.id)} className="btn-pro btn-ghost btn-danger" style={{ padding: '8px' }}>
                      <FiTrash2 />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal Visualisation */}
      <AnimatePresence>
        {showModal && selected && (
          <div className="admin-modal-overlay" onClick={() => setShowModal(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
          }}>
            <motion.div 
              className="admin-card" 
              style={{ maxWidth: '700px', width: '100%', padding: '2.5rem' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{selected.subject}</h3>
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600 }}>
                    <FiUser /> {selected.name} <span style={{ color: 'var(--gray-300)' }}>|</span> <FiMail /> {selected.email}
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-400)' }}>
                  {new Date(selected.created_at).toLocaleString('fr-FR')}
                </div>
              </div>

              <div style={{ 
                background: 'var(--gray-100)', padding: '2rem', borderRadius: '12px', 
                color: 'var(--gray-700)', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' 
              }}>
                {selected.message}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', justifyContent: 'flex-end' }}>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-pro btn-primary">
                  <FiMail /> Répondre par email
                </a>
                <button onClick={() => handleDelete(selected.id)} className="btn-pro btn-danger">
                  <FiTrash2 /> Supprimer
                </button>
                <button onClick={() => setShowModal(false)} className="btn-pro btn-ghost">Fermer</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
