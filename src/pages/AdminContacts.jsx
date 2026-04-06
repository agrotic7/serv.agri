import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiInbox, FiTrash2, FiEye, FiMail, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import './Admin.css';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
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
  const handleDelete = (id) => { setToDeleteId(id); setShowDeleteModal(true); };
  const confirmDelete = async () => {
    if (toDeleteId) {
      await supabase.from('contacts').delete().eq('id', toDeleteId);
      fetchContacts();
    }
    setShowDeleteModal(false);
    setToDeleteId(null);
    if (selected?.id === toDeleteId) { setShowModal(false); setSelected(null); }
  };

  const filtered = contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-section">
      {/* Modal Suppression */}
      {showDeleteModal && (
        <div className="admin-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '3rem', marginBottom: 8, color: '#dc2626' }}><FiAlertCircle /></div>
            <h3 style={{ fontWeight: 700, color: '#1a3c1f' }}>Supprimer ce message ?</h3>
            <p style={{ color: '#6b7280' }}>Cette action est irréversible.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
              <button className="delete-btn" onClick={confirmDelete}>Oui, supprimer</button>
              <button className="cancel-edit-btn" onClick={() => setShowDeleteModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal visualisation */}
      {showModal && selected && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-box" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 700, color: '#1a3c1f', marginBottom: 8 }}>{selected.subject}</h3>
            <div style={{ color: '#4bbf73', fontWeight: 600, marginBottom: 4 }}>{selected.name} — {selected.email}</div>
            <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: 16 }}>
              {selected.created_at ? new Date(selected.created_at).toLocaleString('fr-FR') : ''}
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap', textAlign: 'left' }}>
              {selected.message}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="publish-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiMail /> Répondre
              </a>
              <button className="delete-btn" onClick={() => { setShowModal(false); handleDelete(selected.id); }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiTrash2 /> Supprimer
              </button>
              <button className="cancel-edit-btn" onClick={() => setShowModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-page-header dashboard">
        <span className="admin-page-icon" style={{ fontSize: '1.8rem', color: '#16a34a' }}><FiMessageSquare /></span>
        <div>
          <h2>Messages de contact</h2>
          <p className="admin-page-desc">{contacts.length} message{contacts.length > 1 ? 's' : ''} reçu{contacts.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="admin-list">
        <div className="filter-buttons" style={{ marginBottom: 16, justifyContent: 'flex-start' }}>
          <input
            type="text"
            placeholder="Rechercher par nom, email, sujet..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-box-inline"
            style={{ flex: 1, maxWidth: 400 }}
          />
        </div>

        {loading ? (
          <p style={{ color: '#4bbf73', textAlign: 'center' }}>Chargement...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16, color: '#cbd5e1' }}><FiInbox /></div>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, color: '#334155' }}>Aucun message trouvé.</p>
            <p style={{ fontSize: '0.95rem' }}>Les messages soumis via le formulaire de contact apparaîtront ici.</p>
          </div>
        ) : (
          <div className="list-header">
            <div>Nom</div>
            <div>Email</div>
            <div>Sujet</div>
            <div>Date</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>
        )}
        {filtered.map((contact, idx) => (
          <motion.div
            key={contact.id}
            className="list-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
          >
            <div className="item-title">{contact.name}</div>
            <div className="item-date" style={{ fontSize: '0.9rem' }}>{contact.email}</div>
            <div className="item-title" style={{ fontSize: '0.9rem', color: '#6b7280' }}>{contact.subject}</div>
            <div className="item-date">
              {contact.created_at ? new Date(contact.created_at).toLocaleDateString('fr-FR') : '—'}
            </div>
            <div className="item-actions">
              <button onClick={() => handleView(contact)} className="edit-btn" title="Voir le message"><FiEye size={16} /></button>
              <a href={`mailto:${contact.email}?subject=Re: ${contact.subject}`} className="publish-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Répondre"><FiMail size={16} /></a>
              <button onClick={() => handleDelete(contact.id)} className="delete-btn" title="Supprimer"><FiTrash2 size={16} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
