import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/feed', { withCredentials: true });
        setIsAuthenticated(response.status === 200);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isAuthenticated === null) {
    // мгновенно показываем оверлей-заглушку
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#111', // можно любой цвет
          zIndex: 9999,
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
