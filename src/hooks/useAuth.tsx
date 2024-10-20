import { registerService } from '../services/register';
import { loginService } from '../services/login';
import { useState, useEffect } from 'react';

interface RegisterParams {
    name: string;
    email: string;
    phone: string;
}

interface LoginParams {
    email: string;
    password: string;
}

export const useAuth = () => {
    // Registro
    const handleRegister = async ({ name, email, phone }: RegisterParams): Promise<string> => {
        try {
            const message = await registerService({ name, email, phone });
            return message;
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    };

    // Login
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    // Check if the token is in localStorage
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async ({ email, password }: LoginParams) => {
        try {
            const response = await loginService({ email, password });
            localStorage.setItem('accessToken', response.accessToken); // Save token in localStorage
            setIsAuthenticated(true); // Update the authenticated state
        } catch (error) {
            console.error('Error during login:', error);
            throw new Error('Login failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
    };

    return { register: handleRegister, login, logout, isAuthenticated, loading  };
};