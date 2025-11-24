import React from 'react';
import './Header.css';
import {User} from "../../types/auth";

interface HeaderProps {
    user: User | null;
    onLoginClick: () => void;
    onRegisterClick: () => void;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
                                                  user,
                                                  onLoginClick,
                                                  onRegisterClick,
                                                  onLogout
                                              }) => {
    return (
        <header className="header">
            <div className="header-content">
                <h1 className="logo">FilmNavigator</h1>

                <nav className="nav">
                    {user ? (
                        <div className="user-section">
                            <span>Welcome, {user.username}</span>
                            <button onClick={onLogout} className="btn btn-outline">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-section">
                            <button onClick={onLoginClick} className="btn btn-login">
                                Login
                            </button>
                            <button onClick={onRegisterClick} className="btn btn-register">
                                Register
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};