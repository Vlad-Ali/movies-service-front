import React, {useEffect, useState} from 'react';
import './App.css';
import { User } from "./types/auth";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Header } from "./components/auth/Header";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import {MoviesPage} from "./components/movie/page/MoviesPage";

function AppContent() {
  const { user, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = (userData: User, token: string) => {
    login(userData, token);
  };

  const handleLogout = () => {
    logout();
  };

  const handleRegisterSuccess = () => {
    alert('Registration successful! Please login.');
  };

  useEffect(() => {
      const handleAuthError = () => {
          console.log('🔄 App received auth-error event');
          logout();
          alert('Your session has expired. Please login again.');
      };

      window.addEventListener('auth-error', handleAuthError);

      return () => {
          window.removeEventListener('auth-error', handleAuthError);
      };
      }, [logout]);

  return (
      <div className="App">
        <Header
            user={user}
            onLoginClick={() => setShowLogin(true)}
            onRegisterClick={() => setShowRegister(true)}
            onLogout={handleLogout}
        />

        <main>
          <MoviesPage />
        </main>

        {showLogin && (
            <Login
                onSuccess={handleLoginSuccess}
                onSwitchToRegister={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
                onClose={() => setShowLogin(false)}
            />
        )}

        {showRegister && (
            <Register
                onSuccess={handleRegisterSuccess}
                onSwitchToLogin={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
                onClose={() => setShowRegister(false)}
            />
        )}
      </div>
  );
}

function App() {
  console.log('App component rendered');

  return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
  );
}

export default App;