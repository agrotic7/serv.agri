import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import './Admin.css';
import { motion } from 'framer-motion';

const CATEGORIES = [
  'Innovation',
  'Événements',
  'Partenariats',
  'Technologies',
  'Développement durable'
];

function Admin() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [realisations, setRealisations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    image: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft', // 'draft' ou 'published'
    featured: false
  });
  const [realisationFormData, setRealisationFormData] = useState({
    title: '',
    date: '',
    images: [],
    excerpt: '',
    fullContent: '',
    status: 'draft',
    featured: false
  });
  const [editingId, setEditingId] = useState(null);
  const [editingRealisationId, setEditingRealisationId] = useState(null);
  const [newsFilter, setNewsFilter] = useState('all'); // 'all', 'draft', 'published'
  const [realisationFilter, setRealisationFilter] = useState('all'); // 'all', 'draft', 'published'
  const [newsSearchTerm, setNewsSearchTerm] = useState('');
  const [realisationSearchTerm, setRealisationSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageRealisationPreviews, setImageRealisationPreviews] = useState([]);

  const uploadImage = async (file) => {
    // Cette fonction simule l'upload d'image vers un backend.
    // Pour une vraie application, vous enverriez le fichier à votre serveur.
    // Exemple avec fetch vers un backend Node.js:

    // const formData = new FormData();
    // formData.append('image', file);

    // try {
    //     const response = await fetch('http://localhost:5000/api/upload-image', {
    //         method: 'POST',
    //         body: formData,
    //     });
    //     const data = await response.json();
    //     if (response.ok) {
    //         return data.imageUrl; // Ceci serait l'URL de l'image depuis votre serveur
    //     } else {
    //         console.error('Erreur lors de l\'upload de l\'image:', data.message);
    //         return null;
    //     }
    // } catch (error) {
    //     console.error('Erreur réseau lors de l\'upload de l\'image:', error);
    //     return null;
    // }

    // Pour l'instant, nous continuons avec base64 pour que l'aperçu fonctionne sans backend
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result); // C'est le base64
        };
        reader.readAsDataURL(file);
    });
};

  // Charger les actualités au montage du composant
  useEffect(() => {
    const savedNews = localStorage.getItem('news');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    }
    const savedRealisations = localStorage.getItem('realisations');
    if (savedRealisations) {
      setRealisations(JSON.parse(savedRealisations));
    }
  }, []);

  // Sauvegarder les actualités dans le localStorage
  const saveNews = (updatedNews) => {
    localStorage.setItem('news', JSON.stringify(updatedNews));
    setNews(updatedNews);
  };

  // Sauvegarder les réalisations dans le localStorage
  const saveRealisations = (updatedRealisations) => {
    try {
      console.log('Attempting to save realisations:', updatedRealisations);
      
      // Vérifier si les données sont valides
      if (!Array.isArray(updatedRealisations)) {
        throw new Error('Les données à sauvegarder ne sont pas un tableau');
      }

      // Vérifier la taille des données
      const dataSize = new Blob([JSON.stringify(updatedRealisations)]).size;
      console.log('Data size:', dataSize, 'bytes');
      
      if (dataSize > 5 * 1024 * 1024) { // 5MB limite
        throw new Error('Les données sont trop volumineuses pour le localStorage');
      }

      // Sauvegarder les données
      localStorage.setItem('realisations', JSON.stringify(updatedRealisations));
      setRealisations(updatedRealisations);
      console.log('Realisations saved successfully');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        data: updatedRealisations
      });
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRealisationInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRealisationFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Prévisualisation immédiate
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload de l'image (simulé ou réel)
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
          image: imageUrl // Ici, nous stockerions l'URL du serveur
        }));
      }
    }
  };

  // Fonction pour redimensionner une image avec une compression plus agressive
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Dimensions maximales réduites
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compression plus agressive (50% de qualité)
          const resizedImage = canvas.toDataURL('image/jpeg', 0.5);
          resolve(resizedImage);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRealisationImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Limiter le nombre d'images à 5
      if (realisationFormData.images.length + files.length > 5) {
        alert('Vous ne pouvez pas ajouter plus de 5 images par réalisation');
        return;
      }

      try {
        for (const file of files) {
          // Redimensionner l'image
          const resizedImage = await resizeImage(file);
          
          setRealisationFormData(prev => ({
            ...prev,
            images: [...prev.images, resizedImage]
          }));
          setImageRealisationPreviews(prev => [...prev, resizedImage]);
        }
      } catch (error) {
        console.error('Error processing images:', error);
        alert('Une erreur est survenue lors du traitement des images');
      }
    }
  };

  // Fonction pour nettoyer le localStorage
  const cleanupLocalStorage = () => {
    try {
      // Supprimer les anciennes données si nécessaire
      const savedRealisations = localStorage.getItem('realisations');
      if (savedRealisations) {
        const realisations = JSON.parse(savedRealisations);
        // Garder seulement les 10 dernières réalisations
        if (realisations.length > 10) {
          const recentRealisations = realisations.slice(-10);
          localStorage.setItem('realisations', JSON.stringify(recentRealisations));
          setRealisations(recentRealisations);
        }
      }
    } catch (error) {
      console.error('Error cleaning up localStorage:', error);
    }
  };

  // Appeler le nettoyage au chargement
  useEffect(() => {
    cleanupLocalStorage();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Modification d'une actualité existante
      const updatedNews = news.map(item => 
        item.id === editingId ? { ...formData, id: editingId } : item
      );
      saveNews(updatedNews);
      setEditingId(null);
    } else {
      // Ajout d'une nouvelle actualité
      const newNews = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      saveNews([...news, newNews]);
    }

    // Réinitialiser le formulaire
    setFormData({
      title: '',
      date: '',
      image: '',
      excerpt: '',
      content: '',
      category: '',
      status: 'draft',
      featured: false
    });
    setImagePreview(null);
  };

  const handleRealisationSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting realisation form:', realisationFormData);
    
    // Validation des champs requis
    if (!realisationFormData.title || !realisationFormData.date || !realisationFormData.excerpt) {
      alert('Veuillez remplir tous les champs obligatoires (titre, date et extrait)');
      return;
    }

    // Validation des images
    if (realisationFormData.images.length === 0) {
      alert('Veuillez ajouter au moins une image');
      return;
    }

    // Vérifier la taille totale des données
    const totalSize = new Blob([JSON.stringify(realisationFormData)]).size;
    if (totalSize > 2 * 1024 * 1024) { // 2MB limite
      alert('Les données sont trop volumineuses. Veuillez réduire le nombre d\'images ou leur taille.');
      return;
    }
    
    try {
      if (editingRealisationId) {
        const updatedRealisations = realisations.map(item => 
          item.id === editingRealisationId ? { ...realisationFormData, id: editingRealisationId } : item
        );
        saveRealisations(updatedRealisations);
        setEditingRealisationId(null);
      } else {
        const newRealisation = {
          ...realisationFormData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };
        console.log('Adding new realisation:', newRealisation);
        saveRealisations([...realisations, newRealisation]);
      }

      // Réinitialiser le formulaire
      setRealisationFormData({
        title: '',
        date: '',
        images: [],
        excerpt: '',
        fullContent: '',
        status: 'draft',
        featured: false
      });
      setImageRealisationPreviews([]);
      
      // Confirmation de succès
      alert('La réalisation a été sauvegardée avec succès !');
    } catch (error) {
      console.error('Error saving realisation:', error);
      alert(`Une erreur est survenue lors de la sauvegarde de la réalisation: ${error.message}`);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      date: item.date,
      image: item.image,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      status: item.status,
      featured: item.featured
    });
    setImagePreview(item.image);
    setEditingId(item.id);
  };

  const handleRealisationEdit = (item) => {
    setRealisationFormData({
      title: item.title,
      date: item.date,
      images: item.images || [],
      excerpt: item.excerpt,
      fullContent: item.fullContent,
      status: item.status,
      featured: item.featured
    });
    setImageRealisationPreviews(item.images || []);
    setEditingRealisationId(item.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      const updatedNews = news.filter(item => item.id !== id);
      saveNews(updatedNews);
    }
  };

  const handleRealisationDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réalisation ?')) {
      const updatedRealisations = realisations.filter(item => item.id !== id);
      saveRealisations(updatedRealisations);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedNews = news.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    saveNews(updatedNews);
  };

  const handleRealisationStatusChange = (id, newStatus) => {
    const updatedRealisations = realisations.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    saveRealisations(updatedRealisations);
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    }
  };

  const filteredNews = news
    .filter(item => {
      if (newsFilter === 'all') return true;
      return item.status === newsFilter;
    })
    .filter(item =>
      item.title.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(newsSearchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredRealisations = realisations
    .filter(item => {
      if (realisationFilter === 'all') return true;
      return item.status === realisationFilter;
    })
    .filter(item =>
      item.title.toLowerCase().includes(realisationSearchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(realisationSearchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  console.log('Filtered News:', filteredNews);

  const removeImage = (index) => {
    setRealisationFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageRealisationPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="admin-container"
    >
      <div className="admin-header">
        <h1>Tableau de bord Admin</h1>
        <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
      </div>

      <nav className="admin-sub-nav">
        <Link to="news" className="admin-sub-nav-link">Administration des Actualités</Link>
        <Link to="realisations" className="admin-sub-nav-link">Administration des Réalisations</Link>
      </nav>

      <div className="admin-content">
        <Outlet />
      </div>
    </motion.div>
  );
}

export default Admin; 