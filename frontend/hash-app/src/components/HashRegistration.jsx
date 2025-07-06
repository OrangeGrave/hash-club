import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Функция валидации поля
  const validateField = (field) => {
    const value = field.value.trim();
    const fieldId = field.getAttribute('id');
    field.classList.remove('error', 'success');
    const statusIcons = field.parentElement.querySelectorAll('.hash-registration-field-status');
    statusIcons.forEach(icon => icon.style.display = 'none');
    const existingError = field.parentElement.querySelector('.hash-registration-error-message');
    if (existingError) existingError.remove();
    if (value === '') return;

    // Объявляем переменные вне switch
    let isValid = true;
    let errorMessage = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s\-()]+$/;

    switch (fieldId) {
      case 'username':
        isValid = value.length >= 3;
        errorMessage = value.length < 3 ? 'Минимум 3 символа' : '';
        if (isValid) {
          isValid = /^[a-zA-Z0-9_]+$/.test(value);
          errorMessage = !isValid ? 'Только буквы, цифры и подчеркивание' : '';
        }
        break;
      case 'contact':
        if (value.includes('@')) {
          isValid = emailRegex.test(value);
          errorMessage = !isValid ? 'Некорректный email' : '';
        } else {
          isValid = phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
          errorMessage = !isValid ? 'Некорректный номер телефона' : '';
        }
        break;
      case 'password':
        isValid = value.length >= 6;
        errorMessage = !isValid ? 'Пароль должен содержать минимум 6 символов' : '';
        break;
      case 'confirm-password':
        const passwordValue = document.getElementById('password').value;
        isValid = value === passwordValue && passwordValue !== '';
        errorMessage = !isValid && passwordValue !== '' ? 'Пароли не совпадают' : '';
        break;
      default:
        break;
    }

    if (!isValid) {
      field.classList.add('error');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'hash-registration-error-message';
      errorDiv.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>${errorMessage}`;
      field.parentElement.appendChild(errorDiv);
    } else if (value !== '') {
      field.classList.add('success');
      const successIcon = field.parentElement.querySelector('.hash-registration-field-status.success');
      if (successIcon) successIcon.style.display = 'flex';
    }
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

  // Обработка событий ввода и переключения видимости пароля
  useEffect(() => {
    const inputs = document.querySelectorAll('.hash-registration-input');
    const passwordToggle = document.querySelector('.hash-registration-password-toggle');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const contactInput = document.getElementById('contact');
    const contactIcon = contactInput ? contactInput.previousElementSibling : null;

    let isPasswordVisible = false;

    // Переключение видимости пароля
    const togglePasswordVisibility = () => {
      isPasswordVisible = !isPasswordVisible;
      if (password) password.type = isPasswordVisible ? 'text' : 'password';
      if (confirmPassword) confirmPassword.type = isPasswordVisible ? 'text' : 'password';
      if (passwordToggle) {
        passwordToggle.innerHTML = isPasswordVisible ?
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>' :
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
      }
    };

    // Динамическая смена иконки для поля contact
    const updateContactIcon = () => {
      if (!contactInput || !contactIcon) return;
      const value = contactInput.value.trim();
      if (value.includes('@')) {
        contactIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
      } else if (/^[+]?[\d\s\-()]+$/.test(value) && value.length > 0) {
        contactIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
      } else {
        contactIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
      }
    };

    // Привязка событий
    if (passwordToggle) passwordToggle.addEventListener('click', togglePasswordVisibility);
    if (contactInput) contactInput.addEventListener('input', updateContactIcon);
    inputs.forEach(input => {
      const inputHandler = () => {
        console.log(`Input event on ${input.id}: ${input.value}`);
        validateField(input);
      };
      input.addEventListener('input', inputHandler);
      input.addEventListener('blur', () => validateField(input));
      input._inputHandler = inputHandler;
    });

    // Очистка событий
    return () => {
      if (passwordToggle) passwordToggle.removeEventListener('click', togglePasswordVisibility);
      if (contactInput) contactInput.removeEventListener('input', updateContactIcon);
      inputs.forEach(input => {
        if (input._inputHandler) {
          input.removeEventListener('input', input._inputHandler);
          input.removeEventListener('blur', () => validateField(input));
        }
      });
    };
  }, []);

  // Обработка изменений в полях ввода
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Сопоставляем id="confirm-password" с ключом confirmPassword
    const fieldKey = id === 'confirm-password' ? 'confirmPassword' : id;
    setFormData(prev => {
      const newData = { ...prev, [fieldKey]: value };
      console.log('Form Data:', JSON.stringify(newData, null, 2));
      return newData;
    });
    // Перезапуск валидации для confirm-password при изменении password
    if (id === 'password') {
      const confirmPasswordInput = document.getElementById('confirm-password');
      if (confirmPasswordInput && confirmPasswordInput.value !== '') {
        validateField(confirmPasswordInput);
      }
    }
  };

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const inputs = document.querySelectorAll('.hash-registration-input');
    let isValid = true;

    inputs.forEach(input => {
      const value = input.value.trim();
      const fieldId = input.getAttribute('id');
      input.classList.remove('error', 'success');
      const statusIcons = input.parentElement.querySelectorAll('.hash-registration-field-status');
      statusIcons.forEach(icon => icon.style.display = 'none');
      const existingError = input.parentElement.querySelector('.hash-registration-error-message');
      if (existingError) existingError.remove();

      let errorMessage = '';
      if (value === '') {
        isValid = false;
        errorMessage = 'Поле обязательно для заполнения';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+]?[\d\s\-()]+$/;
        switch (fieldId) {
          case 'username':
            if (value.length < 3) {
              isValid = false;
              errorMessage = 'Минимум 3 символа';
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
              isValid = false;
              errorMessage = 'Только буквы, цифры и подчеркивание';
            }
            break;
          case 'contact':
            if (value.includes('@')) {
              if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Некорректный email';
              }
            } else {
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
          case 'confirm-password':
            if (value !== document.getElementById('password').value) {
              isValid = false;
              errorMessage = 'Пароли не совпадают';
            }
            break;
          default:
            break;
        }
      }

      if (!isValid) {
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'hash-registration-error-message';
        errorDiv.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>${errorMessage}`;
        input.parentElement.appendChild(errorDiv);
      } else {
        input.classList.add('success');
        const successIcon = input.parentElement.querySelector('.hash-registration-field-status.success');
        if (successIcon) successIcon.style.display = 'flex';
      }
    });

    if (isValid) {
      // Сохранение данных в localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({
        username: formData.username,
        contact: formData.contact,
        password: formData.password,
      });
      localStorage.setItem('users', JSON.stringify(users));
      // Установка флага авторизации
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', formData.username);
      setTimeout(() => {
        navigate('/login');
        setIsSubmitting(false);
      }, 1000); // Имитация задержки сервера
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
                  className="hash-registration-input"
                  placeholder="Имя пользователя"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <span className="hash-registration-field-status success" style={{ display: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </span>
              </div>
              <div className="hash-registration-field">
                <span className="hash-registration-field-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  type="text"
                  className="hash-registration-input"
                  placeholder="Email или телефон"
                  id="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                />
                <span className="hash-registration-field-status success" style={{ display: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </span>
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
                  type="password"
                  className="hash-registration-input"
                  placeholder="Пароль"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button type="button" className="hash-registration-password-toggle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
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
                  type="password"
                  className="hash-registration-input"
                  placeholder="Повторите пароль"
                  id="confirm-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <span className="hash-registration-field-status success" style={{ display: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </span>
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
            <p>Уже есть аккаунт? <a href="/login" className="hash-registration-link">Войти</a></p>
          </div>
          <div className="hash-registration-footer">
            <p>© 2025 Hash. <a href="#">Условия использования</a> · <a href="#">Конфиденциальность</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashRegistration;