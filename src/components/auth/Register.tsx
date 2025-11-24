import React, { useState } from 'react';
import { authService } from '../../services/authService';
import './Auth.css';

interface RegisterProps {
    onSuccess: () => void;
    onSwitchToLogin: () => void;
    onClose: () => void;
}

export const Register: React.FC<RegisterProps> = ({
                                                      onSuccess,
                                                      onSwitchToLogin,
                                                      onClose
                                                  }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.register(formData);
            onSuccess();
            onSwitchToLogin();
        } catch (err) {
            setError('Registration failed. Please try again.');
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
                    <h2>Register</h2>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error">{error}</div>}

                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Already have an account? </span>
                    <button onClick={onSwitchToLogin} className="switch-btn">
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};