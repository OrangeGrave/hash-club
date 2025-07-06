import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/FeedPage.css';

const FeedPage = () => {
  const navigate = useNavigate();
  const mockPosts = [
    { id: 1, username: 'user1', text: 'Хочу изучить React, кто поможет?', status: 'pending' },
    { id: 2, username: 'coder123', text: 'Ищу команду для хакатона!', status: 'pending' },
    { id: 3, username: 'dev_guru', text: 'Продам курс по JavaScript', status: 'pending' },
    { id: 4, username: 'techie', text: 'Нужен ментор по Python', status: 'pending' },
    { id: 5, username: 'web_dev', text: 'Ищу партнера для стартапа', status: 'pending' },
    { id: 6, username: 'js_ninja', text: 'Делюсь опытом по Node.js', status: 'pending' },
    { id: 7, username: 'ai_lover', text: 'Кто знает хорошие курсы по ML?', status: 'pending' },
    { id: 8, username: 'frontend_guru', text: 'Нужна помощь с CSS Grid', status: 'pending' },
    { id: 9, username: 'backend_pro', text: 'Ищу работу на Django', status: 'pending' },
    { id: 10, username: 'devops', text: 'Настрою CI/CD для вашего проекта', status: 'pending' },
    { id: 11, username: 'mobile_dev', text: 'Ищу фриланс по Flutter', status: 'pending' },
    { id: 12, username: 'designer', text: 'Создам UI/UX дизайн для приложения', status: 'pending' },
  ];

  const [posts, setPosts] = useState(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    const lowerQuery = searchQuery.toLowerCase();
    return posts.filter(post =>
      post.username.toLowerCase().includes(lowerQuery) ||
      post.text.toLowerCase().includes(lowerQuery)
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
    navigate('/create-post'); // Предполагается, что есть маршрут для создания поста
  };

  return (
    <div className="hash-feed">
      <header className="hash-feed-header">
        <h1 className="hash-feed-title">Лента</h1>
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
              placeholder="Поиск заявок..."
              value={searchQuery}
              onChange={handleSearch}
              aria-label="Поиск заявок"
            />
          </div>
        </div>
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
      </header>
      <div className="hash-feed-content">
        <div className="hash-feed-container">
          <div className="hash-feed-posts">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <div key={post.id} className="hash-feed-post" style={{ animationDelay: `${index * 0.1}s` }}>
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
                  <p className="hash-feed-post-text">{post.text}</p>
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
      <button
        className="hash-feed-create-button"
        onClick={handleCreatePost}
        aria-label="Создать новую заявку"
        title="Создать новую заявку"
      >
        Создать заявку
      </button>
    </div>
  );
};

export default FeedPage;