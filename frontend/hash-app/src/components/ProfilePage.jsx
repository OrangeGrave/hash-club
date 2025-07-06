import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: 'Текущий пользователь',
    email: 'user@example.com',
    bio: 'Привет! Я изучаю программирование и люблю делиться опытом.',
    postsCount: 12,
    followers: 45,
    following: 30,
    avatar: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser({ ...user, username: savedUser });
      setEditedUser({ ...editedUser, username: savedUser });
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser({ ...editedUser, avatar: avatarPreview });
    setIsEditing(false);
    localStorage.setItem('currentUser', editedUser.username);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEditedUser(prev => ({ ...prev, [id]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setEditedUser(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    navigate('/welcome');
  };

  return (
    <div className="hash-profile">
      <header className="hash-profile-header">
        <h1 className="hash-profile-title">Профиль</h1>
        <div className="hash-profile-search-container">
          <div className="hash-profile-search">
            <span className="hash-profile-search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              className="hash-profile-search-input"
              placeholder="Поиск по профилю..."
              aria-label="Поиск по профилю"
            />
          </div>
        </div>
        <div className="hash-profile-profile-logout">
          <button
            className="hash-profile-edit-button"
            onClick={handleEdit}
            aria-label="Редактировать профиль"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Редактировать
          </button>
          <button
            className="hash-profile-logout-button"
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
      <div className="hash-profile-content">
        <div className="hash-profile-container">
          <div className="hash-profile-card">
            <div className="hash-profile-avatar">
              {isEditing ? (
                <label htmlFor="avatar-upload" className="hash-profile-avatar-upload">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Аватар" className="hash-profile-avatar-preview" />
                  ) : user.avatar ? (
                    <img src={user.avatar} alt="Аватар" className="hash-profile-avatar-preview" />
                  ) : (
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hash-profile-avatar-input"
                  />
                </label>
              ) : user.avatar ? (
                <img src={user.avatar} alt="Аватар" className="hash-profile-avatar-preview" />
              ) : (
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>
            <div className="hash-profile-info">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    id="username"
                    value={editedUser.username}
                    onChange={handleChange}
                    className="hash-profile-input"
                  />
                  <input
                    type="text"
                    id="email"
                    value={editedUser.email}
                    onChange={handleChange}
                    className="hash-profile-input"
                  />
                  <textarea
                    id="bio"
                    value={editedUser.bio}
                    onChange={handleChange}
                    className="hash-profile-textarea"
                    placeholder="Опишите свои интересы..."
                  />
                  <button
                    className="hash-profile-save-button"
                    onClick={handleSave}
                    aria-label="Сохранить изменения"
                  >
                    Сохранить
                  </button>
                </>
              ) : (
                <>
                  <h2 className="hash-profile-username">{user.username}</h2>
                  <p className="hash-profile-email">{user.email}</p>
                  <p className="hash-profile-bio">{user.bio}</p>
                  <div className="hash-profile-stats">
                    <span>Посты: {user.postsCount}</span>
                    <span>Подписчики: {user.followers}</span>
                    <span>Подписки: {user.following}</span>
                  </div>
                  <button
                    className="hash-profile-edit-button"
                    onClick={handleEdit}
                    aria-label="Редактировать профиль"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Редактировать
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;