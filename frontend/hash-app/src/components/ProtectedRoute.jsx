import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Предполагаем аутентификацию

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
      }
    };

    // Проверяем аутентификацию в фоне
    checkAuth();
  }, []);

  // Мгновенный рендер без лоадера, редирект только если проверка провалится
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;