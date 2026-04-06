import React, { useState } from 'react';
import './Contact.css';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { supabase } from '../supabaseClient';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus('error');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    // Simulate API call
    try {
      const response = await fetch('https://formspree.io/f/mrbkkpqr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Sauvegarde aussi dans Supabase
        await supabase.from('contacts').insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }]).catch(() => {}); // Silencieux si la table n'existe pas encore

        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await response.json();
        console.error('Formspree error:', data);
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }

    setTimeout(() => setStatus(''), 3000);
  };
                                                
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Contactez SERVAGRI | Solutions agricoles au Sénégal</title>
        <meta name="description" content="Contactez l'équipe SERVAGRI pour toute demande de devis, d'information ou d'accompagnement sur vos projets d'irrigation et d'agriculture de précision au Sénégal." />
      </Helmet>
      <section className="contact-page-section py-5" id="contact">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="display-4 fw-bold text-dark mb-3">Contactez-nous</h2>
            <p className="lead text-muted">Nous sommes à votre écoute pour répondre à toutes vos questions</p>
          </div>
          
          <div className="row justify-content-center mb-5">
            <div className="col-lg-10">
              <div className="contact-info-grid">
                <div className="contact-info-item">
                  <div className="icon-wrapper">
                    <i className="fas fa-map-marker-alt contact-icon"></i>
                  </div>
                  <h5>Notre Bureau</h5>
                  <p>Dakar, Sénégal<br /></p>
                </div>
                <div className="contact-info-item">
                  <div className="icon-wrapper">
                    <i className="fas fa-phone-alt contact-icon"></i>
                  </div>
                  <h5>Appelez-nous</h5>
                  <p>+221 77 027 92 69<br />Lun - Ven, 9h - 18h</p>
                </div>
                <div className="contact-info-item">
                  <div className="icon-wrapper">
                    <i className="fas fa-envelope contact-icon"></i>
                  </div>
                  <h5>Envoyez-nous un Email</h5>
                  <p>servagri4@gmail.com<br />Réponse sous 24h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="contact-form-container">
                <div className="form-header mb-4">
                  <h3 className="fw-bold text-dark">Envoyez-nous un message</h3>
                  <p className="text-muted">Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-group mb-4">
                        <span className="input-group-text"><i className="fas fa-user"></i></span>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          placeholder="Votre Nom Complet"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-4">
                        <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          placeholder="Votre Adresse Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="input-group mb-4">
                    <span className="input-group-text"><i className="fas fa-tag"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      name="subject"
                      placeholder="Sujet du Message"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-group mb-4">
                    <span className="input-group-text"><i className="fas fa-comment-alt"></i></span>
                    <textarea
                      className="form-control"
                      name="message"
                      rows="6"
                      placeholder="Votre Message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-success btn-lg">
                      Envoyer le Message <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                  {status === 'sending' && <div className="alert alert-info mt-3 text-center">Envoi en cours...</div>}
                  {status === 'success' && <div className="alert alert-success mt-3 text-center">Message envoyé avec succès!</div>}
                  {status === 'error' && <div className="alert alert-danger mt-3 text-center">Erreur lors de l'envoi. Veuillez remplir tous les champs.</div>}
                </form>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="map-container">
                <div className="map-header mb-4">
                  <h3 className="fw-bold text-dark">Notre localisation</h3>
                  <p className="text-muted">Venez nous rendre visite à notre bureau</p>
                </div>
                <div className="map-wrapper">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15391.294148143637!2d-17.4677!3d14.6928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec10d12fda3c87f%3A0xc3d7bfc4eb2fb68a!2sDakar%2C%20S%C3%A9n%C3%A9gal!5e0!3m2!1sfr!2ssn!4v1700000000000!5m2!1sfr!2ssn"
                    width="100%"
                    height="450"
                    style={{ border: 0, borderRadius: '10px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation SERVAGRI - Dakar, Sénégal"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact; 