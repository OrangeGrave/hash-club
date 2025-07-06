import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/FeedPage.css';

const FeedPage = () => {
  // Моковые данные для ленты
  const mockPosts = [
    { id: 1, username: 'user1', text: 'Хочу изучить React, кто поможет?', status: 'pending' },
    { id: 2, username: 'coder123', text: 'Ищу команду для хакатона!', status: 'pending' },
    { id: 3, username: 'dev_guru', text: 'Продам курс по JavaScript', status: 'pending' },
    { id: 4, username: 'techie', text: 'Нужен ментор по Python', status: 'pending' },
  ];

  const [posts, setPosts] = useState(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');

  // Обработчик поиска (заглушка)
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Логика фильтрации постов может быть добавлена здесь
    console.log('Поиск:', e.target.value);
  };

  // Обработчики для кнопок Принять/Отклонить
  const handleAccept = (id) => {
    console.log(`Заявка ${id} принята`);
    setPosts(posts.map(post => post.id === id ? { ...post, status: 'accepted' } : post));
  };

  const handleReject = (id) => {
    console.log(`Заявка ${id} отклонена`);
    setPosts(posts.map(post => post.id === id ? { ...post, status: 'rejected' } : post));
  };

  // Обработчик создания заявки (заглушка)
  const handleCreatePost = () => {
    console.log('Открыть форму создания заявки');
  };

  return (
    <div className="hash-feed">
      <header className="hash-feed-header">
        <h1 className="hash-feed-title">Лента</h1>
        <div className="hash-feed-search">
          <span className="hash-feed-search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          />
        </div>
      </header>
      <div className="hash-feed-container">
        <div className="hash-feed-posts">
          {posts.map((post, index) => (
            <div key={post.id} className="hash-feed-post" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="hash-feed-post-header">
                <Link to={`/profile/${post.username}`} className="hash-feed-post-username">
                  <span className="hash-feed-post-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                >
                  Принять
                </button>
                <button
                  className={`hash-feed-post-button reject ${post.status === 'rejected' ? 'disabled' : ''}`}
                  onClick={() => handleReject(post.id)}
                  disabled={post.status === 'accepted' || post.status === 'rejected'}
                >
                  Отклонить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="hash-feed-create-button" onClick={handleCreatePost}>
        Создать заявку
      </button>
    </div>
  );
};

export default FeedPage;