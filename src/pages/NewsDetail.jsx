import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NewsDetail.css';
import { supabase } from '../supabaseClient';
import { useState as useSessionState, useEffect as useSessionEffect } from 'react';
import { Helmet } from 'react-helmet';

const AUTHOR = {
  name: 'Équipe Servagri',
  avatar: 'https://ui-avatars.com/api/?name=Servagri&background=4CAF50&color=fff&size=128',
};

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  // Commentaires interactifs
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentForm, setCommentForm] = useState({ author: '', content: '' });
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [commentLikes, setCommentLikes] = useState({}); // {commentId: likeCount}
  const [likedComments, setLikedComments] = useState([]); // [commentId]
  const [commentsPage, setCommentsPage] = useState(1);
  const COMMENTS_PER_PAGE = 5;
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [replyTo, setReplyTo] = useState(null); // id du commentaire auquel on répond
  const [replyForm, setReplyForm] = useState({ author: '', content: '' });
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyError, setReplyError] = useState('');
  // Gestion de la session utilisateur Supabase
  const [user, setUser] = useState(null);
  const [similarNews, setSimilarNews] = useState([]);
  useEffect(() => {
    const session = supabase.auth.getSession ? null : supabase.auth.session();
    if (session && session.user) {
      setUser(session.user);
    }
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      listener?.unsubscribe && listener.unsubscribe();
    };
  }, []);

  // Connexion Google
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };
  // Déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, [id]);

  // Charger les commentaires liés à la news + likes (pagination)
  useEffect(() => {
    if (!id) return;
    setCommentLoading(true);
    const fetchComments = async () => {
      const from = 0;
      const to = COMMENTS_PER_PAGE - 1;
      const { data, error, count } = await supabase
        .from('comments')
        .select('*, comment_likes(count)', { count: 'exact' })
        .eq('news_id', id)
        .order('created_at', { ascending: false })
        .range(from, to);
      if (!error && data) {
        setComments(data);
        // Récupérer le nombre de likes pour chaque commentaire
        const likesMap = {};
        data.forEach(c => {
          likesMap[c.id] = (c.comment_likes && c.comment_likes.length > 0) ? c.comment_likes[0].count : 0;
        });
        setCommentLikes(likesMap);
        setHasMoreComments(data.length === COMMENTS_PER_PAGE);
        setCommentsPage(1);
      }
      setCommentLoading(false);
    };
    fetchComments();
    // Charger les likes déjà faits (localStorage)
    const liked = JSON.parse(localStorage.getItem('likedComments') || '[]');
    setLikedComments(liked);
  }, [id]);

  // Charger plus de commentaires (lazy loading)
  const handleLoadMoreComments = async () => {
    const from = comments.length;
    const to = from + COMMENTS_PER_PAGE - 1;
    setCommentLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*, comment_likes(count)')
      .eq('news_id', id)
      .order('created_at', { ascending: false })
      .range(from, to);
    if (!error && data) {
      setComments(prev => [...prev, ...data]);
      // Mettre à jour les likes
      const likesMap = { ...commentLikes };
      data.forEach(c => {
        likesMap[c.id] = (c.comment_likes && c.comment_likes.length > 0) ? c.comment_likes[0].count : 0;
      });
      setCommentLikes(likesMap);
      setHasMoreComments(data.length === COMMENTS_PER_PAGE);
      setCommentsPage(prev => prev + 1);
    }
    setCommentLoading(false);
  };

  // Ajout d'un commentaire
  const handleCommentChange = (e) => {
    setCommentForm({ ...commentForm, [e.target.name]: e.target.value });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');
    if (!commentForm.author.trim() || !commentForm.content.trim()) {
      setCommentError('Veuillez remplir votre nom et votre commentaire.');
      return;
    }
    setCommentSubmitting(true);
    // Générer avatar
    const avatar_url = `https://ui-avatars.com/api/?name=${encodeURIComponent(commentForm.author)}&background=E0E0E0&color=333&size=64`;
    const { error } = await supabase.from('comments').insert([
      {
        news_id: id,
        author: commentForm.author,
        avatar_url,
        content: commentForm.content,
      },
    ]);
    if (error) {
      setCommentError("Erreur lors de l'envoi du commentaire.");
    } else {
      setCommentForm({ author: '', content: '' });
      // Rafraîchir la liste
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('news_id', id)
        .order('created_at', { ascending: false });
      setComments(data || []);
    }
    setCommentSubmitting(false);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = news ? encodeURIComponent(news.title) : '';
    let shareUrl = '';
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`;
    }
    window.open(shareUrl, '_blank');
  };

  // Like d'un commentaire
  const handleLikeComment = async (commentId) => {
    if (likedComments.includes(commentId)) return; // déjà liké
    // Ajout en base
    await supabase.from('comment_likes').insert([
      { comment_id: commentId, user_id: null } // user_id null si pas d'auth
    ]);
    // Rafraîchir les likes
    const { data } = await supabase
      .from('comment_likes')
      .select('comment_id', { count: 'exact', head: false })
      .eq('comment_id', commentId);
    setCommentLikes(prev => ({ ...prev, [commentId]: data.length }));
    // Marquer comme liké localement
    const updated = [...likedComments, commentId];
    setLikedComments(updated);
    localStorage.setItem('likedComments', JSON.stringify(updated));
  };

  // Ajout d'une réponse à un commentaire
  const handleReplyChange = (e) => {
    setReplyForm({ ...replyForm, [e.target.name]: e.target.value });
  };
  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    setReplyError('');
    if (!replyForm.author.trim() || !replyForm.content.trim()) {
      setReplyError('Veuillez remplir votre nom et votre réponse.');
      return;
    }
    setReplySubmitting(true);
    const avatar_url = `https://ui-avatars.com/api/?name=${encodeURIComponent(replyForm.author)}&background=E0E0E0&color=333&size=64`;
    const { error } = await supabase.from('comments').insert([
      {
        news_id: id,
        author: replyForm.author,
        avatar_url,
        content: replyForm.content,
        parent_id: parentId,
      },
    ]);
    if (error) {
      setReplyError("Erreur lors de l'envoi de la réponse.");
    } else {
      setReplyForm({ author: '', content: '' });
      setReplyTo(null);
      // Rafraîchir les commentaires (reload la page 1)
      setCommentsPage(1);
      setHasMoreComments(true);
      // Recharge les commentaires principaux (reset)
      const from = 0;
      const to = COMMENTS_PER_PAGE - 1;
      const { data } = await supabase
        .from('comments')
        .select('*, comment_likes(count)', { count: 'exact' })
        .eq('news_id', id)
        .order('created_at', { ascending: false })
        .range(from, to);
      setComments(data || []);
    }
    setReplySubmitting(false);
  };

  // Charger les articles similaires
  useEffect(() => {
    if (!news) return;
    const fetchSimilar = async () => {
      let query = supabase
        .from('news')
        .select('*')
        .neq('id', news.id)
        .order('created_at', { ascending: false })
        .limit(4);
      if (news.category) {
        query = query.eq('category', news.category);
      }
      const { data, error } = await query;
      if (!error && data) setSimilarNews(data);
    };
    fetchSimilar();
  }, [news]);

  // Incrémenter le compteur de vues (une seule fois par visite)
  useEffect(() => {
    if (!news || !news.id) return;
    const viewedKey = `news_viewed_${news.id}`;
    if (!localStorage.getItem(viewedKey)) {
      supabase.from('news').update({ views: (news.views || 0) + 1 }).eq('id', news.id);
      localStorage.setItem(viewedKey, '1');
    }
  }, [news]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!news) {
    return (
      <div className="error-container">
        <h2>Actualité non trouvée</h2>
        <button onClick={() => navigate('/actualites')} className="back-button">
          Retour aux actualités
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{news.title} | Servagri</title>
        <meta name="description" content={news.excerpt || news.content?.slice(0, 160)} />
        {/* OpenGraph */}
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.excerpt || news.content?.slice(0, 160)} />
        <meta property="og:image" content={news.image_url} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={news.title} />
        <meta name="twitter:description" content={news.excerpt || news.content?.slice(0, 160)} />
        <meta name="twitter:image" content={news.image_url} />
      </Helmet>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="news-detail-container"
    >
        {/* Fil d'Ariane */}
        <nav className="breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate('/')}>Accueil</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-link" onClick={() => navigate('/actualites')}>Actualités</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{news.title}</span>
        </nav>

      <div className="news-detail-header">
        <button onClick={() => navigate('/actualites')} className="back-button">
          ← Retour aux actualités
        </button>
      </div>

      <article className="news-detail">
          <motion.div 
            className="news-detail-image-container"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
          <img src={news.image_url} alt={news.title} className="news-detail-image" />
          </motion.div>

        <div className="news-detail-content">
            <div className="news-detail-meta">
              <img src={AUTHOR.avatar} alt={AUTHOR.name} className="news-detail-author-avatar" />
              <div>
                <span className="news-detail-author">{AUTHOR.name}</span>
          <span className="news-detail-date">{news.date}</span>
              </div>
            </div>

          <h1 className="news-detail-title">{news.title}</h1>
            <div className="news-detail-views">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:4}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {news.views || 0} vues
            </div>
          <div className="news-detail-excerpt">{news.excerpt}</div>

            <hr className="news-detail-separator" />

          <div className="news-detail-full-content">
            {news.content}
          </div>

          {news.category && (
            <div className="news-detail-category">
              <span className="category-label">Catégorie :</span>
              <span className="category-value">{news.category}</span>
            </div>
          )}

            {/* Affichage des tags si présents */}
            {news.tags && Array.isArray(news.tags) && news.tags.length > 0 && (
              <div className="news-detail-tags">
                <span className="tags-label">Tags :</span>
                {news.tags.map((tag, idx) => (
                  <span className="news-tag" key={idx}>{tag}</span>
                ))}
              </div>
            )}

            <hr className="news-detail-separator" />

            <div className="news-detail-share">
              <span>Partager :</span>
              <button className="share-btn facebook" onClick={() => handleShare('facebook')} title="Partager sur Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.326v-21.349c0-.734-.593-1.326-1.326-1.326z"/></svg>
              </button>
              <button className="share-btn twitter" onClick={() => handleShare('twitter')} title="Partager sur Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482c-4.083-.205-7.697-2.162-10.125-5.134a4.822 4.822 0 0 0-.664 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636a10.012 10.012 0 0 0 2.457-2.548z"/></svg>
              </button>
              <button className="share-btn linkedin" onClick={() => handleShare('linkedin')} title="Partager sur LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.23 0H1.77C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.77 24h20.459C23.208 24 24 23.229 24 22.271V1.723C24 .771 23.208 0 22.23 0zM7.12 20.452H3.56V9h3.56v11.452zM5.34 7.633a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM20.452 20.452h-3.554v-5.569c0-1.328-.025-3.037-1.85-3.037-1.85 0-2.132 1.445-2.132 2.939v5.667h-3.554V9h3.414v1.561h.049c.476-.899 1.637-1.85 3.37-1.85 3.602 0 4.267 2.37 4.267 5.455v6.286z"/></svg>
              </button>
            </div>
        </div>
      </article>

        {/* Section commentaires interactive */}
        <section className="news-comments-section">
          <h2 className="comments-title">Commentaires</h2>
          <div style={{display:'flex', justifyContent:'flex-end', marginBottom:8}}>
            {user ? (
              <button onClick={handleLogout} style={{fontSize:'0.95rem', color:'#4CAF50', background:'none', border:'none', cursor:'pointer'}}>Se déconnecter</button>
            ) : null}
          </div>
          {commentLoading && comments.length === 0 ? (
            <div>Chargement des commentaires...</div>
          ) : (
            <div className="comments-list">
              {comments.length === 0 && <div style={{color:'#888'}}>Aucun commentaire pour l'instant.</div>}
              {comments
                .filter(c => !c.parent_id)
                .map((c) => (
                  <div className="comment-item" key={c.id}>
                    <div className="comment-avatar">
                      <img src={c.avatar_url} alt={c.author} />
                    </div>
                    <div className="comment-content">
                      <span className="comment-author">{c.author}</span>
                      <span className="comment-date">{new Date(c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <div className="comment-text">{c.content}</div>
                      <div className="comment-likes-row">
                        <button
                          className={`comment-like-btn${likedComments.includes(c.id) ? ' liked' : ''}`}
                          onClick={() => handleLikeComment(c.id)}
                          disabled={likedComments.includes(c.id)}
                          title={likedComments.includes(c.id) ? 'Vous avez déjà aimé' : 'Aimer'}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill={likedComments.includes(c.id) ? '#4CAF50' : 'none'} stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                          <span style={{marginLeft:6}}>{commentLikes[c.id] || 0}</span>
                        </button>
                      </div>
                      <button className="comment-reply-btn" onClick={() => setReplyTo(c.id)} style={{marginTop:8}}>
                        Répondre
                      </button>
                      {/* Affichage du formulaire de réponse */}
                      {replyTo === c.id && (
                        <form className="comment-form" onSubmit={e => handleReplySubmit(e, c.id)} style={{marginTop:'1rem', background:'#f5f5f5', borderRadius:8, padding:'1rem'}}>
                          <input
                            className="comment-input"
                            name="author"
                            placeholder="Votre nom..."
                            value={replyForm.author}
                            onChange={handleReplyChange}
                            required
                            style={{maxWidth:'300px'}}
                          />
                          <textarea
                            className="comment-input"
                            name="content"
                            placeholder="Votre réponse..."
                            rows="2"
                            value={replyForm.content}
                            onChange={handleReplyChange}
                            required
                          ></textarea>
                          {replyError && <div style={{color:'red', marginBottom:8}}>{replyError}</div>}
                          <button type="submit" className="comment-submit" disabled={replySubmitting}>
                            {replySubmitting ? 'Envoi...' : 'Envoyer'}
                          </button>
                          <button type="button" className="comment-cancel-btn" onClick={() => setReplyTo(null)} style={{marginLeft:12}}>Annuler</button>
                        </form>
                      )}
                      {/* Affichage des réponses (1 niveau) */}
                      {comments.filter(r => r.parent_id === c.id).length > 0 && (
                        <div className="comment-replies">
                          {comments.filter(r => r.parent_id === c.id).map(r => (
                            <div className="comment-item reply" key={r.id}>
                              <div className="comment-avatar">
                                <img src={r.avatar_url} alt={r.author} />
                              </div>
                              <div className="comment-content">
                                <span className="comment-author">{r.author}</span>
                                <span className="comment-date">{new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                <div className="comment-text">{r.content}</div>
                                <div className="comment-likes-row">
                                  <button
                                    className={`comment-like-btn${likedComments.includes(r.id) ? ' liked' : ''}`}
                                    onClick={() => handleLikeComment(r.id)}
                                    disabled={likedComments.includes(r.id)}
                                    title={likedComments.includes(r.id) ? 'Vous avez déjà aimé' : 'Aimer'}
                                  >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill={likedComments.includes(r.id) ? '#4CAF50' : 'none'} stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    <span style={{marginLeft:6}}>{commentLikes[r.id] || 0}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              {hasMoreComments && (
                <button
                  className="comment-load-more"
                  onClick={handleLoadMoreComments}
                  disabled={commentLoading}
                  style={{ margin: '1.2rem auto 0', display: 'block' }}
                >
                  {commentLoading ? 'Chargement...' : 'Charger plus de commentaires'}
                </button>
              )}
            </div>
          )}
          <form className="comment-form" onSubmit={handleCommentSubmit} style={{marginTop:'1.5rem'}}>
            <input
              className="comment-input"
              name="author"
              placeholder="Votre nom..."
              value={commentForm.author}
              onChange={handleCommentChange}
              required
              style={{maxWidth:'300px'}}
            />
            <textarea
              className="comment-input"
              name="content"
              placeholder="Votre commentaire..."
              rows="3"
              value={commentForm.content}
              onChange={handleCommentChange}
              required
            ></textarea>
            {commentError && <div style={{color:'red', marginBottom:8}}>{commentError}</div>}
            <button type="submit" className="comment-submit" disabled={commentSubmitting}>
              {commentSubmitting ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
        </section>
        {/* Articles similaires */}
        {similarNews.length > 0 && (
          <section className="news-similar-section">
            <h2 className="news-similar-title">Articles similaires</h2>
            <div className="news-similar-list">
              {similarNews.map(item => (
                <div className="news-similar-card" key={item.id} onClick={() => navigate(`/actualites/${item.id}`)}>
                  <div className="news-similar-img-wrap">
                    <img src={item.image_url} alt={item.title} className="news-similar-img" />
                  </div>
                  <div className="news-similar-content">
                    <span className="news-similar-date">{item.date}</span>
                    <h3 className="news-similar-title-card">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
    </motion.div>
    </>
  );
}

export default NewsDetail; 