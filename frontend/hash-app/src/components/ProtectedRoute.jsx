import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Проверка аутентификации на /feed...');
        const response = await api.get('/feed', {
          withCredentials: true, // Отправка HttpOnly куки
        });
        console.log('Ответ от /feed:', response.status, response.data);
        setIsAuthenticated(response.status === 200);
      } catch (error) {
        console.error('Ошибка проверки аутентификации:', error.response ? error.response.status : error.message, error.response ? error.response.data : '');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Добавим небольшую задержку, чтобы дать время куки установиться
    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, []);

  console.log('ProtectedRoute: isAuthenticated:', isAuthenticated, 'Loading:', isLoading);

  if (isLoading) {
    return <div>Проверка аутентификации...</div>; // Лоадер
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;