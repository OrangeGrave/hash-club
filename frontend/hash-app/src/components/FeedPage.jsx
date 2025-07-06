import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/FeedPage.css';

const FeedPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([
    { id: 1, username: 'user1', text: 'Хочу изучить React, кто поможет?', status: 'pending', image: null, interest: 'Программирование', hashtags: '#React #Помощь' },
    { id: 2, username: 'coder123', text: 'Ищу команду для хакатона!', status: 'pending', image: null, interest: 'Разработка', hashtags: '#Команда #Хакатон' },
    { id: 3, username: 'dev_guru', text: 'Продам курс по JavaScript', status: 'pending', image: null, interest: 'Обучение', hashtags: '#JavaScript #Курс' },
    { id: 4, username: 'techie', text: 'Нужен ментор по Python', status: 'pending', image: null, interest: 'Программирование', hashtags: '#Python #Ментор' },
    { id: 5, username: 'web_dev', text: 'Ищу партнера для стартапа', status: 'pending', image: null, interest: 'Бизнес', hashtags: '#Стартап #Партнер' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPost, setNewPost] = useState({ text: '', image: null, interest: '', hashtags: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [isCreateVisible, setIsCreateVisible] = useState(false);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    const lowerQuery = searchQuery.toLowerCase();
    return posts.filter(post =>
      (post.username.toLowerCase().includes(lowerQuery) ||
       post.text.toLowerCase().includes(lowerQuery) ||
       post.interest.toLowerCase().includes(lowerQuery) ||
       (post.hashtags && post.hashtags.toLowerCase().includes(lowerQuery.replace('#', ''))))
    );
  }, [searchQuery, posts]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    navigate('/welcome');
  };

  const handleAccept = (id) => {
    const postExists = posts.find(post => post.id === id);
    if (!postExists) return;
    console.log(`Заявка ${id} принята`);
    setPosts(prev => prev.map(post => post.id === id ? { ...post, status: 'accepted' } : post));
  };

  const handleReject = (id) => {
    const postExists = posts.find(post => post.id === id);
    if (!postExists) return;
    console.log(`Заявка ${id} отклонена`);
    setPosts(prev => prev.map(post => post.id === id ? { ...post, status: 'rejected' } : post));
  };

  const handleCreatePost = () => {
    if (!newPost.hashtags.trim()) {
      alert('Хэштег обязателен!');
      return;
    }
    if (newPost.text.trim() || imagePreview || newPost.interest.trim()) {
      const newId = posts.length + 1;
      const postToAdd = {
        ...newPost,
        id: newId,
        status: 'pending',
        image: imagePreview,
        hashtags: newPost.hashtags,
      };
      setPosts([...posts, postToAdd]);
      setNewPost({ text: '', image: null, interest: '', hashtags: '' });
      setImagePreview(null);
      setIsCreateVisible(false);
      navigate('/feed');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewPost(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelCreate = () => {
    setNewPost({ text: '', image: null, interest: '', hashtags: '' });
    setImagePreview(null);
    setIsCreateVisible(false);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const newPosts = [...posts];
    const [draggedPost] = newPosts.splice(dragIndex, 1);
    newPosts.splice(dropIndex, 0, draggedPost);
    setPosts(newPosts);
  };

  return (
    <div className="hash-feed">
      <header className="hash-feed-header">
        <h1 className="hash-feed-title">HASH</h1>
        <div className="hash-feed-search-container">
          <div className="hash-feed-search">
            <span className="hash-feed-search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              className="hash-feed-search-input"
              placeholder="Поиск по хэшам..."
              value={searchQuery}
              onChange={handleSearch}
              aria-label="Поиск заявок"
            />
          </div>
        </div>
        <div className="hash-feed-profile-logout">
        <button
            className="hash-feed-create-button-header"
            onClick={() => setIsCreateVisible(true)}
            aria-label="Создать новую заявку"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Создать заявку
          </button>
          <button
            className="hash-feed-profile-button"
            onClick={() => navigate('/profile')}
            aria-label="Перейти в профиль"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Профиль
          </button>
          <button
            className="hash-feed-logout-button"
            onClick={handleLogout}
            aria-label="Выйти из аккаунта"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Выйти
          </button>

        </div>
      </header>
      <div className="hash-feed-content">
        <div className="hash-feed-container">
          <div className="hash-feed-posts">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="hash-feed-post"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="hash-feed-post-header">
                    <Link to={`/profile/${post.username}`} className="hash-feed-post-username">
                      <span className="hash-feed-post-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </span>
                      {post.username}
                    </Link>
                  </div>
                  {post.image && <img src={post.image} alt="Пост" className="hash-feed-post-image" />}
                  <p className="hash-feed-post-text">{post.text}</p>
                  <p className="hash-feed-post-interest">Интерес: {post.interest}</p>
                  <div className="hash-feed-post-hashtags-vertical">
                    {post.hashtags.split(' ').map((tag, tagIndex) => (
                      tag && <span key={tagIndex}>#{tag}</span>
                    ))}
                  </div>
                  <div className="hash-feed-post-actions">
                    <button
                      className={`hash-feed-post-button accept ${post.status === 'accepted' ? 'disabled' : ''}`}
                      onClick={() => handleAccept(post.id)}
                      disabled={post.status === 'accepted' || post.status === 'rejected'}
                      aria-label={`Принять заявку от ${post.username}`}
                      title="Принять"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                    <button
                      className={`hash-feed-post-button reject ${post.status === 'rejected' ? 'disabled' : ''}`}
                      onClick={() => handleReject(post.id)}
                      disabled={post.status === 'accepted' || post.status === 'rejected'}
                      aria-label={`Отклонить заявку от ${post.username}`}
                      title="Отклонить"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="8" y1="8" x2="16" y2="16"></line>
                        <line x1="8" y1="16" x2="16" y2="8"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="hash-feed-no-posts">Заявки не найдены</p>
            )}
          </div>
        </div>
      </div>
      {isCreateVisible && (
        <div className="hash-feed-create-overlay">
          <div className="hash-feed-create-form">
            <h2>Создать заявку</h2>
            <textarea
              className="hash-feed-create-text"
              placeholder="Напишите текст заявки..."
              value={newPost.text}
              onChange={(e) => setNewPost(prev => ({ ...prev, text: e.target.value }))}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hash-feed-create-image"
            />
            {imagePreview && <img src={imagePreview} alt="Предпросмотр" className="hash-feed-create-preview" />}
            <input
              type="text"
              className="hash-feed-create-interest"
              placeholder="Ваши интересы..."
              value={newPost.interest}
              onChange={(e) => setNewPost(prev => ({ ...prev, interest: e.target.value }))}
            />
            <input
              type="text"
              className="hash-feed-create-hashtags"
              placeholder="Хэштеги (через пробел, например: #React #Помощь)..."
              value={newPost.hashtags}
              onChange={(e) => setNewPost(prev => ({ ...prev, hashtags: e.target.value }))}
              required
            />
            <button
              className="hash-feed-create-button"
              onClick={handleCreatePost}
              aria-label="Создать новую заявку"
            >
              Создать
            </button>
            <button
              className="hash-feed-create-cancel"
              onClick={handleCancelCreate}
              aria-label="Отменить создание"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedPage;