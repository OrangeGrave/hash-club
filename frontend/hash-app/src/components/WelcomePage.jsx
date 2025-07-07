import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/WelcomePage.css';

const WelcomePage = () => {
  const motivationMessages = [
    'Присоединяйся к поиску по интересам с HASH',
    'Найди единомышленников с HASH',
    'Создай свою историю с HASH',
    'Исследуй новые возможности с HASH',
    'Стань частью сообщества HASH',
  ];

  const [currentMessage, setCurrentMessage] = useState(motivationMessages[0]);
  const [isFading, setIsFading] = useState(false);

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
      }, 300); // Время для завершения анимации исчезновения
    }, 10000); // Смена текста каждые 10 секунд

    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, [motivationMessages]);

  return (
    <div className="welcome-page">
      <div className="welcome-page-container">
        <div className="welcome-page-header">
          <h1 className="welcome-page-title">HASH</h1>
          <p className={`welcome-page-motivation ${isFading ? 'fade' : 'visible'}`}>
            {currentMessage}
          </p>
        </div>
        <div className="welcome-page-buttons">
          <Link to="/login" className="welcome-page-button">
            Войти
          </Link>
          <Link to="/register" className="welcome-page-button">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;