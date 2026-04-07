import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import './FloatingContact.css';

const FloatingContact = () => {
  const whatsappNumber = "221770279269"; // Numéro officiel de Madu
  const message = encodeURIComponent("Bonjour ! Je souhaite avoir plus de renseignements sur les solutions SERVAGRI.");

  return (
    <a 
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      className="floating-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <div className="whatsapp-tooltip">Besoin d'un conseil ?</div>
      <FiMessageCircle className="whatsapp-icon" />
    </a>
  );
};

export default FloatingContact;
