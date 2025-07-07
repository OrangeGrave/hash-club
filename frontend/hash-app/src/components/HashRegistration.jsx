import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/HashRegistration.css';

const HashRegistration = () => {
  const motivationMessages = [
    'Присоединяйтесь к HASH сегодня',
    'Создайте свой профиль с HASH',
    'Найдите единомышленников с HASH',
    'Начните свое путешествие с HASH',
    'Станьте частью сообщества HASH',
  ];
  const [msgIndex, setMsgIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    contact: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [contactIcon, setContactIcon] = useState('email');
  const navigate = useNavigate();

  useEffect(() => {
    const iv = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % motivationMessages.length);
        setIsFading(false);
      }, 300);
    }, 10000);
    return () => clearInterval(iv);
  }, []);

  const validate = (key, val, all = form) => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^[+]?[\d\s\-()]+$/;
    if (!val.trim()) return 'Обязательно';
    if (key === 'username') {
      if (val.length < 3) return 'Минимум 3 символа';
      if (!/^[\w]+$/.test(val)) return 'Только буквы, цифры, _';
    }
    if (key === 'contact') {
      if (val.includes('@') && !emailRe.test(val)) return 'Некорректный email';
      if (!val.includes('@') && (!phoneRe.test(val) || val.replace(/\D/g, '').length < 10))
        return 'Некорректный телефон';
    }
    if (key === 'password' && val.length < 6) return 'Минимум 6 символов';
    if (key === 'confirmPassword' && val !== all.password) return 'Не совпадает';
    return '';
  };

  const onChange = e => {
    const { id, value } = e.target;
    const key = id === 'confirm-password' ? 'confirmPassword' : id;
    const next = { ...form, [key]: value };
    setForm(next);
    setErrors(prev => ({ ...prev, [key]: validate(key, value, next) }));
    if (key === 'contact') {
      setContactIcon(value.includes('@') ? 'email' : 'phone');
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    const errs = {};
    let ok = true;
    Object.entries(form).forEach(([k, v]) => {
      const er = validate(k, v, form);
      if (er) ok = false;
      errs[k] = er;
    });
    setErrors(errs);
    if (!ok) return;

    setSubmitting(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      const res = await api.post('/register', {
        username: form.username,
        identity: form.contact,
        password: form.password,
        passwordConfirm: form.confirmPassword,
      });
      if (res.status === 201) {
        alert('Успешно зарегистрированы');
        navigate('/login');
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setErrors({ general: 'Пользователь уже существует' });
      } else if (status === 400) {
        setErrors({ general: 'Неверные данные' });
      } else {
        setErrors({ general: 'Ошибка. Попробуйте позже.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Регистрация</h1>
        <p className={`login-subtitle ${isFading ? 'fade' : 'visible'}`}>
          {motivationMessages[msgIndex]}
        </p>

        <form className="login-form" onSubmit={onSubmit} noValidate>
          {/* Username */}
          <div className="field">
            <span className="field-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="username"
              type="text"
              className={`field-input ${errors.username ? 'error' : form.username ? 'success' : ''}`}
              placeholder="Имя пользователя"
              value={form.username}
              onChange={onChange}
            />
            {errors.username && <div className="error-text-small">{errors.username}</div>}
          </div>

          {/* Contact */}
          <div className="field">
            <span className="field-icon">
              {contactIcon === 'email' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16v16H4z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              )}
            </span>
            <input
              id="contact"
              type="text"
              className={`field-input ${errors.contact ? 'error' : form.contact ? 'success' : ''}`}
              placeholder="Email или телефон"
              value={form.contact}
              onChange={onChange}
            />
            {errors.contact && <div className="error-text-small">{errors.contact}</div>}
          </div>

          {/* Password */}
          <div className="field">
            <span className="field-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="password"
              type="password"
              className={`field-input ${errors.password ? 'error' : form.password ? 'success' : ''}`}
              placeholder="Пароль"
              value={form.password}
              onChange={onChange}
            />
            {errors.password && <div className="error-text-small">{errors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div className="field">
            <span className="field-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="confirm-password"
              type="password"
              className={`field-input ${errors.confirmPassword ? 'error' : form.confirmPassword ? 'success' : ''}`}
              placeholder="Повторите пароль"
              value={form.confirmPassword}
              onChange={onChange}
            />
            {errors.confirmPassword && (
              <div className="error-text-small">{errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Создание...' : 'Зарегистрироваться'}
          </button>
          {errors.general && <div className="error-text-small general">{errors.general}</div>}
        </form>

        <p className="links">
          Есть аккаунт? <Link to="/login" className="link">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default HashRegistration;
