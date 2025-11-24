import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { User } from '../../types/auth';
import './Auth.css';

interface LoginProps {
    onSuccess: (user: User, token: string) => void;
    onSwitchToRegister: () => void;
    onClose: () => void;
}

export const Login: React.FC<LoginProps> = ({
                                                onSuccess,
                                                onSwitchToRegister,
                                                onClose
                                            }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(formData);
            const userData: User = {
                email: response.email,
                username: response.username
            };
            onSuccess(userData, response.token);
            onClose();
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="auth-modal">
            <div className="auth-content">
                <div className="auth-header">
                    <h2>Login</h2>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error">{error}</div>}

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Don't have an account? </span>
                    <button onClick={onSwitchToRegister} className="switch-btn">
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};