import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/check'); // Эндпоинт для проверки аутентификации
        console.log('Проверка аутентификации:', response.data);
        setIsAuthenticated(response.status === 200);
      } catch (error) {
        console.error('Ошибка проверки аутентификации:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  console.log('ProtectedRoute: isAuthenticated:', isAuthenticated);

  if (isLoading) {
    return <div>Проверка аутентификации...</div>; // Можно заменить на лоадер
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;