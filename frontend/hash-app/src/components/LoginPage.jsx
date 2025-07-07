import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/LoginPage.css';

// Регулярные выражения вынесены наружу для повторного использования
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[\d\s\-()]+$/;

const LoginPage = () => {
  const motivationMessages = [
    'Войдите в Hash сегодня',
    'Продолжайте свое путешествие с Hash',
    'Подключайтесь к сообществу Hash',
    'Откройте новые возможности с Hash',
    'Ваш профиль Hash ждет вас',
  ];

  const [currentMessage, setCurrentMessage] = useState(motivationMessages[0]);
  const [isFading, setIsFading] = useState(false);
  const [formData, setFormData] = useState({
    identity: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [contactIcon, setContactIcon] = useState('email');
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentMessage((prev) => {
          const currentIndex = motivationMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % motivationMessages.length;
          return motivationMessages[nextIndex];
        });
        setIsFading(false);
      }, 300);
    }, 10000);

    // Очистка интервала при размонтировании
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [motivationMessages]);

  useEffect(() => {
    const savedData = localStorage.getItem('rememberedUser');
    if (savedData) {
      const { identity, password } = JSON.parse(savedData);
      setFormData((prev) => ({ ...prev, identity, password }));
      setRememberMe(true);
    }
  }, []);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'identity':
        if (!value.trim()) error = 'Поле обязательно для заполнения';
        else if (value.includes('@')) {
          if (!emailRegex.test(value)) error = 'Некорректный email';
        } else if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
          error = 'Некорректный номер телефона';
        }
        break;
      case 'password':
        if (!value.trim()) error = 'Поле обязательно для заполнения';
        else if (value.length < 5) error = 'Пароль должен содержать минимум 5 символов';
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    const error = validateField(id, value);
    setErrors((prev) => ({
      ...prev,
      [id]: error,
    }));

    if (id === 'identity') {
      if (value.includes('@')) setContactIcon('email');
      else if (phoneRegex.test(value) && value.length > 0) setContactIcon('phone');
      else setContactIcon('email');
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });
    setErrors(newErrors);

    if (isValid) {
      try {
        console.log('Отправка данных на /login:', formData);
        const response = await api.post('/login', {
          identity: formData.identity,
          password: formData.password,
        }, {
          withCredentials: true,
        });

        console.log('Ответ от сервера:', response.status, response.data);
        if (response.status === 200) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('currentUser', formData.identity);

          if (rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify({
              identity: formData.identity,
              password: formData.password,
            }));
          } else {
            localStorage.removeItem('rememberedUser');
          }

          console.log('Переход на /feed');
          navigate('/feed', { replace: true });
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error('Ошибка логина:', error.response ? error.response.status : error.message, error.response ? error.response.data : '');
        setErrors({ general: 'Неверный email/телефон или пароль. Попробуйте снова или проверьте подключение.' });
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="hash-login">
      <div className="hash-login-content">
        <div className="hash-login-container">
          <div className="hash-login-header">
            <div className="hash-login-logo">
              <span className="hash-login-logo-text">#</span>
            </div>
            <h1 className="hash-login-title">Вход</h1>
            <p className={`hash-login-subtitle ${isFading ? 'fade' : 'visible'}`}>
              {currentMessage}
            </p>
          </div>
          <div className="hash-login-form">
            <div className="hash-login-form-content">
              <div className="hash-login-field">
                <span className="hash-login-field-icon">
                  {contactIcon === 'email' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  )}
                </span>
                <input
                  type="text"
                  className={`hash-login-input ${errors.identity ? 'error' : formData.identity ? 'success' : ''}`}
                  placeholder="Email или телефон"
                  id="identity"
                  value={formData.identity}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.identity}
                  aria-describedby={errors.identity ? 'identity-error' : undefined}
                />
                {formData.identity && !errors.identity && (
                  <span className="hash-login-field-status success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                )}
                {errors.identity && (
                  <div className="hash-login-error-message" id="identity-error">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {errors.identity}
                  </div>
                )}
              </div>
              <div className="hash-login-field">
                <span className="hash-login-field-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  className={`hash-login-input ${errors.password ? 'error' : formData.password ? 'success' : ''}`}
                  placeholder="Пароль"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="hash-login-password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {isPasswordVisible ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
                {formData.password && !errors.password && (
                  <span className="hash-login-field-status success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                )}
                {errors.password && (
                  <div className="hash-login-error-message" id="password-error">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {errors.password}
                  </div>
                )}
              </div>
              <div className="hash-login-remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
                <label htmlFor="rememberMe">Запомнить пароль</label>
              </div>
              {errors.general && (
                <div className="hash-login-error-message" id="general-error">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line> {/* Исправлен синтаксис */}
                  </svg>
                  {errors.general}
                </div>
              )}
              <div className="hash-login-security-info">
                <span className="hash-login-security-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </span>
                <span>Данные защищены сквозным шифрованием</span>
              </div>
              <button
                type="submit"
                className="hash-login-submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                aria-label="Войти"
              >
                <span className="hash-login-loading" style={{ display: isSubmitting ? 'flex' : 'none' }}>
                  <span className="hash-login-spinner"></span>
                  Вход...
                </span>
                <span className="hash-login-submit-text" style={{ display: isSubmitting ? 'none' : 'block' }}>
                  Войти
                </span>
              </button>
            </div>
          </div>
          <div className="hash-login-links">
            <p>Нет аккаунта? <Link to="/registration" className="hash-login-link">Зарегистрироваться</Link></p>
          </div>
          <div className="hash-login-footer">
            <p>© 2025 Hash. <a href="#">Условия использования</a> · <a href="#">Конфиденциальность</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;