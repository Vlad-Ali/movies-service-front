export interface User {
    email: string;
    username: string;
}


export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    email: string;
}

export interface RegisterData {
    email: string;
    password: string;
    username: string;
}

export interface RegisterResponse {
    username: string;
    email: string;
}