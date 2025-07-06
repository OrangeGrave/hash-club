import React, { useEffect } from 'react';
import '../styles/HashRegistration.css';

const HashRegistration = () => {
    useEffect(() => {
        const inputs = document.querySelectorAll('.hash-registration-input');
        const passwordToggle = document.querySelector('.hash-registration-password-toggle');
        const passwordInput = document.getElementById('password');
        const contactInput = document.getElementById('contact');
        const contactIcon = contactInput.previousElementSibling;

        let isPasswordVisible = false;

        passwordToggle.addEventListener('click', function() {
            isPasswordVisible = !isPasswordVisible;
            passwordInput.type = isPasswordVisible ? 'text' : 'password';
            this.innerHTML = isPasswordVisible ?
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>' :
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        });

        contactInput.addEventListener('input', function() {
            const value = this.value.trim();
            if (value.includes('@')) {
                contactIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
            } else if (/^[\+]?[\d\s\-\(\)]+$/.test(value) && value.length > 0) {
                contactIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
            } else {
                contactIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
            }
        });

        inputs.forEach(input => {
            input.addEventListener('input', function() { validateField(this); });
            input.addEventListener('blur', function() { validateField(this); });
        });

        function validateField(field) {
            const value = field.value.trim();
            const fieldId = field.getAttribute('id');
            field.classList.remove('error', 'success');
            const statusIcons = field.parentElement.querySelectorAll('.hash-registration-field-status');
            statusIcons.forEach(icon => icon.style.display = 'none');
            const existingError = field.parentElement.querySelector('.hash-registration-error-message');
            if (existingError) existingError.remove();
            if (value === '') return;

            let isValid = true;
            let errorMessage = '';

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
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            isValid = false;
                            errorMessage = 'Некорректный email';
                        }
                    } else {
                        const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
                        if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                            isValid = false;
                            errorMessage = 'Некорректный номер телефона';
                        }
                    }
                    break;
            }

            if (!isValid) {
                field.classList.add('error');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'hash-registration-error-message';
                errorDiv.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>${errorMessage}`;
                field.parentElement.appendChild(errorDiv);
            } else {
                field.classList.add('success');
                const successIcon = field.parentElement.querySelector('.hash-registration-field-status.success');
                if (successIcon) successIcon.style.display = 'flex';
            }
        }
    }, []);

    return (
        <div className="hash-registration">
            <div className="hash-registration-container">
                <div className="hash-registration-header">
                    <div className="hash-registration-logo">
                        <span className="hash-registration-logo-text">#</span>
                    </div>
                    <h1 className="hash-registration-title">Регистрация</h1>
                    <p className="hash-registration-subtitle">Присоединяйтесь к Hash сегодня</p>
                </div>
                <div className="hash-registration-form">
                    <div className="hash-registration-form-content">
                        <div className="hash-registration-field">
                            <span className="hash-registration-field-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </span>
                            <input type="text" className="hash-registration-input" placeholder="Имя пользователя" id="username" />
                            <span className="hash-registration-field-status success" style={{ display: 'none' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20,6 9,17 4,12"></polyline>
                                </svg>
                            </span>
                        </div>
                        <div className="hash-registration-field">
                            <span className="hash-registration-field-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </span>
                            <input type="text" className="hash-registration-input" placeholder="Email или телефон" id="contact" />
                            <span className="hash-registration-field-status success" style={{ display: 'none' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20,6 9,17 4,12"></polyline>
                                </svg>
                            </span>
                        </div>
                        <div className="hash-registration-field">
                            <span className="hash-registration-field-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <circle cx="12" cy="16" r="1"></circle>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </span>
                            <input type="password" className="hash-registration-input" placeholder="Пароль" id="password" />
                            <button type="button" className="hash-registration-password-toggle">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                        <div className="hash-registration-field">
                            <span className="hash-registration-field-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <circle cx="12" cy="16" r="1"></circle>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </span>
                            <input type="password" className="hash-registration-input" placeholder="Повторите пароль" id="confirm-password" />
                            <span className="hash-registration-field-status success" style={{ display: 'none' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20,6 9,17 4,12"></polyline>
                                </svg>
                            </span>
                        </div>
                        <div className="hash-registration-security-info">
                            <span className="hash-registration-security-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </span>
                            <span>Данные защищены сквозным шифрованием</span>
                        </div>
                        <button type="submit" className="hash-registration-submit">
                            <span className="hash-registration-loading" style={{ display: 'none' }}>
                                <span className="hash-registration-spinner"></span>
                                Создание аккаунта...
                            </span>
                            <span className="hash-registration-submit-text">Зарегистрироваться</span>
                        </button>
                    </div>
                </div>
                <div className="hash-registration-links">
                    <p>Уже есть аккаунт? <a href="#" className="hash-registration-link">Войти</a></p>
                </div>
                <div className="hash-registration-footer">
                    <p>© 2025 Hash. <a href="#">Условия использования</a> · <a href="#">Конфиденциальность</a></p>
                </div>
            </div>
        </div>
    );
};

export default HashRegistration;