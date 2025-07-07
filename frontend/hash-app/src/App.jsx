import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HashRegistration from './components/HashRegistration';
import LoginPage from './components/LoginPage';
import FeedPage from './components/FeedPage';
import WelcomePage from './components/WelcomePage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './components/ProfilePage';

const App = () => {
  return (
    <Routes>
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/register" element={<HashRegistration />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<WelcomePage />} />
    </Routes>
  );
};

export default App;