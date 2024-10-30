import { registerService } from '../services/register';
import { loginService } from '../services/login';
import { useState, useEffect } from 'react';

interface RegisterParams {
    name: string;
    email: string;
    phone: string;
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

    const login = async ({ email, password, token }: { email: string; password?: string; token?: string }) => {
        try {
            // Si tienes un `token`, usa `token` en lugar de `password`
            const credentials = token ? { email, token } : { email, password };
            const response = await loginService(credentials);
            localStorage.setItem('accessToken', response.accessToken); 
            setIsAuthenticated(true); 
        } catch (error) {
            console.error('Error durante el inicio de sesión:', error);
            throw new Error('Fallo en el inicio de sesión');
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
    };

    return { register: handleRegister, login, logout, isAuthenticated, loading  };
};