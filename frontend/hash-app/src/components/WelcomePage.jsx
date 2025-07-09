import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/WelcomePage.css';

const WelcomePage = () => {
  const motivationMessages = [
    'Присоединяйся к поиску по интересам с HASH',
    'Найди единомышленников с HASH',
    'Создай свою историю с HASH',
    'Исследуй новые возможности с HASH',
    'Стань частью сообщества HASH',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredLetter, setHoveredLetter] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % motivationMessages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLetterEnter = (index) => setHoveredLetter(index);
  const handleLetterLeave = () => setHoveredLetter(null);

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
            {['H', 'A', 'S', 'H'].map((letter, i) => (
              <span
                key={i}
                className={`letter letter-${letter.toLowerCase()} ${
                  hoveredLetter === i ? 'hovered' : ''
                }`}
                onMouseEnter={() => handleLetterEnter(i)}
                onMouseLeave={handleLetterLeave}
              >
                {letter}
              </span>
            ))}
          </h1>

          <div style={{ position: 'relative', height: 30, marginTop: 10 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
                className="welcome-page-motivation"
                style={{ position: 'absolute', width: '100%' }}
              >
                {motivationMessages[currentIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
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
