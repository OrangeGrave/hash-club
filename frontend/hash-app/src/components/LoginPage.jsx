// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/apiClient'; // ✅ импорт API клиента
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/login', {
        username: form.username,
        password: form.password,
      });

      // Если успешный ответ — переходим
      navigate('/feed');
    } catch (err) {
      const msg = err.response?.data?.error || 'Ошибка при входе';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Вход</h1>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <span className="field-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              name="username"
              type="text"
              className={`field-input ${error && !form.username ? 'error' : ''}`}
              value={form.username}
              onChange={handleChange}
              placeholder="Имя пользователя"
            />
          </div>

          <div className="field">
            <span className="field-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              name="password"
              type="password"
              className={`field-input ${error && !form.password ? 'error' : ''}`}
              value={form.password}
              onChange={handleChange}
              placeholder="Пароль"
            />
          </div>

          <div className="options">
            <label className="remember">
              <input
                name="remember"
                type="checkbox"
                checked={form.remember}
                onChange={handleChange}
              />
              Запомнить меня
            </label>
            {loading && <div className="spinner" />}
          </div>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Входим...' : 'Войти'}
          </button>

          <p className="links">
            Нет аккаунта? <Link to="/register" className="link">Регистрация</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
