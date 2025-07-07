import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Убедитесь, что файл api.js существует
import '../styles/HashRegistration.css';

const HashRegistration = () => {
  const motivationMessages = [
    'Присоединяйтесь к HASH сегодня',
    'Создайте свой профиль с HASH',
    'Найдите единомышленников с HASH',
    'Начните свое путешествие с HASH',
    'Станьте частью сообщества HASH',
  ];

  const [currentMessage, setCurrentMessage] = useState(motivationMessages[0]);
  const [isFading, setIsFading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    contact: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [contactIcon, setContactIcon] = useState('email');
  const navigate = useNavigate();

  const usernameRef = useRef(null);
  const contactRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Валидация полей
  const validateField = (name, value, allValues = formData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s\-()]+$/;
    let error = '';

    switch (name) {
      case 'username':
        if (!value.trim()) error = 'Поле обязательно для заполнения';
        else if (value.length < 3) error = 'Минимум 3 символа';
        else if (!/^[a-zA-Z0-9_]+$/.test(value)) error = 'Только буквы, цифры и подчеркивание';
        break;
      case 'contact':
        if (!value.trim()) error = 'Поле обязательно для заполнения';
        else if (value.includes('@')) {
          if (!emailRegex.test(value)) error = 'Некорректный email';
        } else if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
          error = 'Некорректный номер телефона';
        }
        break;
      case 'password':
        if (!value.trim()) error = 'Поле обязательно для заполнения';
        else if (value.length < 6) error = 'Пароль должен содержать минимум 6 символов';
        break;
      case 'confirmPassword':
        if (!value.trim()) error = 'Поле обязательно для заполнения';
        else if (value !== allValues.password) error = 'Пароли не совпадают';
        break;
      default:
        break;
    }
    return error;
  };

  // Смена мотивационных сообщений
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentMessage(prev => {
          const currentIndex = motivationMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % motivationMessages.length;
          return motivationMessages[nextIndex];
        });
        setIsFading(false);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Обработка изменений в полях ввода
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const fieldKey = id === 'confirm-password' ? 'confirmPassword' : id;
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value,
    }));

    // Валидация текущего поля
    const error = validateField(fieldKey, value);
    setErrors(prev => ({
      ...prev,
      [fieldKey]: error,
    }));

    // Валидация confirmPassword при изменении password
    if (fieldKey === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword, {
        ...formData,
        password: value,
      });
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError,
      }));
    }

    // Обновление иконки для поля contact
    if (fieldKey === 'contact') {
      if (value.includes('@')) {
        setContactIcon('email');
      } else if (/^[+]?[\d\s\-()]+$/.test(value) && value.length > 0) {
        setContactIcon('phone');
      } else {
        setContactIcon('email');
      }
    }
  };

  // Переключение видимости пароля
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    let isValid = true;

    // Валидация всех полей
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);

    if (isValid) {
      try {
        console.log('Отправка данных на /register:', formData);
        const response = await api.post('/register', {
          username: formData.username,
          identity: formData.contact, // contact маппится на identity для бэкенда
          password: formData.password,
          passwordConfirm: formData.confirmPassword,
        });

        console.log('Ответ от сервера:', response);
        if (response.status === 201) {
          alert('Регистрация успешна! Можете войти.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Ошибка регистрации:', error.response ? error.response.data : error.message);
        setErrors({ general: 'Ошибка регистрации. Попробуйте снова.' });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hash-registration">
      <div className="hash-registration-content">
        <div className="hash-registration-container">
          <div className="hash-registration-header">
            <div className="hash-registration-logo">
              <span className="hash-registration-logo-text">#</span>
            </div>
            <h1 className="hash-registration-title">Регистрация</h1>
            <p className={`hash-registration-subtitle ${isFading ? 'fade' : 'visible'}`}>
              {currentMessage}
            </p>
          </div>
          <form className="hash-registration-form" onSubmit={handleSubmit}>
            <div className="hash-registration-form-content">
              <div className="hash-registration-field">
                <span className="hash-registration-field-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  type="text"
                  className={`hash-registration-input ${errors.username ? 'error' : formData.username ? 'success' : ''}`}
                  placeholder="Имя пользователя"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  ref={usernameRef}
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                />
                {formData.username && !errors.username && (
                  <span className="hash-registration-field-status success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </span>
                )}
                {errors.username && (
                  <div className="hash-registration-error-message" id="username-error">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {errors.username}
                  </div>
                )}
              </div>
              <div className="hash-registration-field">
                <span className="hash-registration-field-icon">
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
                  className={`hash-registration-input ${errors.contact ? 'error' : formData.contact ? 'success' : ''}`}
                  placeholder="Email или телефон"
                  id="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  ref={contactRef}
                  aria-invalid={!!errors.contact}
                  aria-describedby={errors.contact ? 'contact-error' : undefined}
                />
                {formData.contact && !errors.contact && (
                  <span className="hash-registration-field-status success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </span>
                )}
                {errors.contact && (
                  <div className="hash-registration-error-message" id="contact-error">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {errors.contact}
                  </div>
                )}
              </div>
              <div className="hash-registration-field">
                <span className="hash-registration-field-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  className={`hash-registration-input ${errors.password ? 'error' : formData.password ? 'success' : ''}`}
                  placeholder="Пароль"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  ref={passwordRef}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="hash-registration-password-toggle"
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
                  <span className="hash-registration-field-status success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </span>
                )}
                {errors.password && (
                  <div className="hash-registration-error-message" id="password-error">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {errors.password}
                  </div>
                )}
              </div>
              <div className="hash-registration-field">
                <span className="hash-registration-field-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  className={`hash-registration-input ${errors.confirmPassword ? 'error' : formData.confirmPassword ? 'success' : ''}`}
                  placeholder="Повторите пароль"
                  id="confirm-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  ref={confirmPasswordRef}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                />
                {formData.confirmPassword && !errors.confirmPassword && (
                  <span className="hash-registration-field-status success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </span>
                )}
                {errors.confirmPassword && (
                  <div className="hash-registration-error-message" id="confirm-password-error">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              <div className="hash-registration-security-info">
                <span className="hash-registration-security-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </span>
                <span>Данные защищены сквозным шифрованием</span>
              </div>
              <button
                type="submit"
                className="hash-registration-submit"
                disabled={isSubmitting}
                aria-label="Зарегистрироваться"
              >
                <span className="hash-registration-loading" style={{ display: isSubmitting ? 'flex' : 'none' }}>
                  <span className="hash-registration-spinner"></span>
                  Создание аккаунта...
                </span>
                <span className="hash-registration-submit-text" style={{ display: isSubmitting ? 'none' : 'block' }}>
                  Зарегистрироваться
                </span>
              </button>
            </div>
          </form>
          <div className="hash-registration-links">
            <p>
              Уже есть аккаунт? <Link to="/login" className="hash-registration-link">Войти</Link>
            </p>
          </div>
          <div className="hash-registration-footer">
            <p>
              © 2025 Hash.{' '}
              <Link to="/terms" className="hash-registration-link">Условия использования</Link> ·{' '}
              <Link to="/privacy" className="hash-registration-link">Конфиденциальность</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashRegistration;