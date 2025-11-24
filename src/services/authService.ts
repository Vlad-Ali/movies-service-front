import {API_BASE_URL, API_ENDPOINTS} from "../config/api";
import {AuthResponse, LoginData, RegisterData, RegisterResponse} from "../types/auth";

export const authService = {
    async login(loginData: LoginData): Promise<AuthResponse> {
        console.log('Login service called ', loginData.email);
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            console.log(`Failed to login user ${response.statusText}`);
            throw new Error('Login failed');
        }

        return response.json();
    },

    async register(registerData: RegisterData): Promise<RegisterResponse> {
        console.log(`Register service called `, registerData.email);
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        });

        if (!response.ok) {
            console.log(`Failed to register user ${response.statusText}`);
            throw new Error('Registration failed');
        }

        return response.json();
    },

}