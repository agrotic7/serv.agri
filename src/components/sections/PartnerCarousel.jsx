import React from 'react';
import './PartnerCarousel.css';

const PARTNERS = [
  { name: 'USSEIN', logo: '/logo_ussein.jpg' },
  { name: 'SERVAGRI', logo: '/servagri_logo.png' },
  { name: 'Sénégal Agri', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Senegal.svg' }, // Placeholder
  { name: 'Agriculture Bio', logo: 'https://cdn-icons-png.flaticon.com/512/2829/2829824.png' }, // Placeholder
  { name: 'Smart Farm', logo: 'https://cdn-icons-png.flaticon.com/512/3074/3074058.png' }, // Placeholder
  { name: 'Eco Water', logo: 'https://cdn-icons-png.flaticon.com/512/414/414923.png' }, // Placeholder
];

const PartnerCarousel = () => {
  // On double la liste pour un effet de défilement infini sans coupure
  const doublePartners = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <div className="partner-carousel-section">
      <div className="container">
        <h4 className="partner-title">Ils nous font confiance</h4>
        <div className="partner-slider">
          <div className="partner-track">
            {doublePartners.map((partner, index) => (
              <div key={index} className="partner-slide">
                <img src={partner.logo} alt={partner.name} title={partner.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerCarousel;
