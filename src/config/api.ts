export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
    REGISTER: '/api/user/register',
    LOGIN: '/api/user/auth',
    GET_USER: '/api/user',
} as const;