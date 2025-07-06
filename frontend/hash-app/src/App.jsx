import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import HashRegistration from './components/HashRegistration';
import LoginPage from './components/LoginPage';
import FeedPage from './components/FeedPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/registration" element={<HashRegistration />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;