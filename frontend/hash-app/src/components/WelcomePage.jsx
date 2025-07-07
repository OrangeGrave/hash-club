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
  const [hoveredLetter, setHoveredLetter] = useState(null);

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

  const handleLetterEnter = (index) => {
    setHoveredLetter(index);
  };

  const handleLetterLeave = () => {
    setHoveredLetter(null);
  };

  return (
    <div className="welcome-page">
      <div className="floating-particles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      <div className="welcome-page-container">
        <div className="welcome-page-header">
          <h1 className="welcome-page-title">
            <span
              className={`letter letter-h ${hoveredLetter === 0 ? 'hovered' : ''}`}
              onMouseEnter={() => handleLetterEnter(0)}
              onMouseLeave={handleLetterLeave}
            >
              H
            </span>
            <span
              className={`letter letter-a ${hoveredLetter === 1 ? 'hovered' : ''}`}
              onMouseEnter={() => handleLetterEnter(1)}
              onMouseLeave={handleLetterLeave}
            >
              A
            </span>
            <span
              className={`letter letter-s ${hoveredLetter === 2 ? 'hovered' : ''}`}
              onMouseEnter={() => handleLetterEnter(2)}
              onMouseLeave={handleLetterLeave}
            >
              S
            </span>
            <span
              className={`letter letter-h2 ${hoveredLetter === 3 ? 'hovered' : ''}`}
              onMouseEnter={() => handleLetterEnter(3)}
              onMouseLeave={handleLetterLeave}
            >
              H
            </span>
          </h1>
          <p className={`welcome-page-motivation ${isFading ? 'fade' : 'visible'}`}>
            {currentMessage}
          </p>
        </div>

        <div className="welcome-page-buttons">
          <Link to="/login" className="welcome-page-button">
            <span className="button-text">Войти</span>
            <div className="button-ripple"></div>
          </Link>
          <Link to="/register" className="welcome-page-button">
            <span className="button-text">Зарегистрироваться</span>
            <div className="button-ripple"></div>
          </Link>
        </div>
      </div>

      <div className="ambient-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
};

export default WelcomePage;