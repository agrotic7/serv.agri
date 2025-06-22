import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

function NavBarPro() {
  const navRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 40) {
          navRef.current.classList.add('sticky');
        } else {
          navRef.current.classList.remove('sticky');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Empêcher le défilement du body quand le menu est ouvert
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.navbar-collapse') && !event.target.closest('.navbar-toggler')) {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav className="navbar navbar-expand-lg fixed-top" ref={navRef}>
      <div className="container">
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <img src="/servagri_logo.png" alt="Logo SERVAGRI" height="45" className="me-2" />
          <span className="fw-bold text-success">SERVAGRI</span>
        </NavLink>
        
        <button 
          className={`navbar-toggler border-0 ${isMenuOpen ? 'active' : ''}`} 
          type="button" 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <div className="mobile-menu-overlay"></div>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => 
                `nav-link px-3 fw-medium ${isActive ? 'active' : ''}`
              } onClick={() => {
                setIsMenuOpen(false);
                document.body.style.overflow = 'auto';
              }}>
                <span className="nav-link-text">Accueil</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/services" className={({ isActive }) => 
                `nav-link px-3 fw-medium ${isActive ? 'active' : ''}`
              } onClick={() => {
                setIsMenuOpen(false);
                document.body.style.overflow = 'auto';
              }}>
                <span className="nav-link-text">Services</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/realisation" className={({ isActive }) => 
                `nav-link px-3 fw-medium ${isActive ? 'active' : ''}`
              } onClick={() => {
                setIsMenuOpen(false);
                document.body.style.overflow = 'auto';
              }}>
                <span className="nav-link-text">Réalisations</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className={({ isActive }) => 
                `nav-link px-3 fw-medium ${isActive ? 'active' : ''}`
              } onClick={() => {
                setIsMenuOpen(false);
                document.body.style.overflow = 'auto';
              }}>
                <span className="nav-link-text">Contact</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBarPro; 