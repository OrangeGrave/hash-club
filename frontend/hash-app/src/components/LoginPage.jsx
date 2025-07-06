import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; // Убедитесь, что файл импортирован правильно

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
    contact: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

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
  }, [motivationMessages]);

  useEffect(() => {
    // Проверка сохраненных данных при загрузке
    const savedData = localStorage.getItem('rememberedUser');
    if (savedData) {
      const { contact, password } = JSON.parse(savedData);
      setFormData(prev => ({ ...prev, contact, password }));
      setRememberMe(true);
    }

    const inputs = document.querySelectorAll('.hash-login-input');
    const passwordToggle = document.querySelector('.hash-login-password-toggle');
    const password = document.getElementById('password');
    const contactInput = document.getElementById('contact');
    const contactIcon = contactInput.previousElementSibling;

    let isPasswordVisible = false;

    passwordToggle.addEventListener('click', function () {
      isPasswordVisible = !isPasswordVisible;
      password.type = isPasswordVisible ? 'text' : 'password';
      this.innerHTML = isPasswordVisible
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    });

    contactInput.addEventListener('input', function () {
      const value = this.value.trim();
      if (value.includes('@')) {
        contactIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
      } else if (/^[+]?[\d\s\-()]+$/.test(value) && value.length > 0) {
        contactIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
      } else {
        contactIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
      }
    });

    inputs.forEach(input => {
      input.addEventListener('input', function () { validateField(this); });
      input.addEventListener('blur', function () { validateField(this); });
    });

    function validateField(field) {
      const value = field.value.trim();
      const fieldId = field.getAttribute('id');
      field.classList.remove('error', 'success');
      const statusIcons = field.parentElement.querySelectorAll('.hash-login-field-status');
      statusIcons.forEach(icon => icon.style.display = 'none');
      const existingError = field.parentElement.querySelector('.hash-login-error-message');
      if (existingError) existingError.remove();
      if (value === '') return;

      let isValid = true;
      let errorMessage = '';

      switch (fieldId) {
        case 'contact':
          if (value.includes('@')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              isValid = false;
              errorMessage = 'Некорректный email';
            }
          } else {
            const phoneRegex = /^[+]?[\d\s\-()]+$/;
            if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
              isValid = false;
              errorMessage = 'Некорректный номер телефона';
            }
          }
          break;
        case 'password':
          if (value.length < 6) {
            isValid = false;
            errorMessage = 'Пароль должен содержать минимум 6 символов';
          }
          break;
      }

      if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'hash-login-error-message';
        errorDiv.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>${errorMessage}`;
        field.parentElement.appendChild(errorDiv);
      } else {
        field.classList.add('success');
        const successIcon = field.parentElement.querySelector('.hash-login-field-status.success');
        if (successIcon) successIcon.style.display = 'flex';
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Валидация всех полей
    const inputs = document.querySelectorAll('.hash-login-input');
    let isValid = true;
    inputs.forEach(input => {
      const value = input.value.trim();
      const fieldId = input.getAttribute('id');
      input.classList.remove('error', 'success');
      const statusIcons = input.parentElement.querySelectorAll('.hash-login-field-status');
      statusIcons.forEach(icon => icon.style.display = 'none');
      const existingError = input.parentElement.querySelector('.hash-login-error-message');
      if (existingError) existingError.remove();

      let errorMessage = '';
      if (value === '') {
        isValid = false;
        errorMessage = 'Поле обязательно для заполнения';
      } else {
        switch (fieldId) {
          case 'contact':
            if (value.includes('@')) {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Некорректный email';
              }
            } else {
              const phoneRegex = /^[+]?[\d\s\-()]+$/;
              if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Некорректный номер телефона';
              }
            }
            break;
          case 'password':
            if (value.length < 6) {
              isValid = false;
              errorMessage = 'Пароль должен содержать минимум 6 символов';
            }
            break;
        }
      }

      if (!isValid) {
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'hash-login-error-message';
        errorDiv.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>${errorMessage}`;
        input.parentElement.appendChild(errorDiv);
      } else {
        input.classList.add('success');
        const successIcon = input.parentElement.querySelector('.hash-login-field-status.success');
        if (successIcon) successIcon.style.display = 'flex';
      }
    });

    if (isValid) {
      // Проверка данных в localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.contact === formData.contact && u.password === formData.password);
      if (user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', user.username);
        if (rememberMe) {
          localStorage.setItem('rememberedUser', JSON.stringify({ contact: formData.contact, password: formData.password }));
        } else {
          localStorage.removeItem('rememberedUser');
        }
        setTimeout(() => {
          navigate('/feed');
          setIsSubmitting(false);
        }, 1000); // Имитация задержки сервера
      } else {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'hash-login-error-message';
        errorDiv.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>Неверный email/телефон или пароль`;
        document.querySelector('.hash-login-form-content').appendChild(errorDiv);
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  type="text"
                  className="hash-login-input"
                  placeholder="Email или телефон"
                  id="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                />
                <span className="hash-login-field-status success" style={{ display: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </span>
              </div>
              <div className="hash-login-field">
                <span className="hash-login-field-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  className="hash-login-input"
                  placeholder="Пароль"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button type="button" className="hash-login-password-toggle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
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
              <div className="hash-login-security-info">
                <span className="hash-login-security-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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