import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginService } from '../services/login';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token'); 
  });

  const navigate = useNavigate();

  // Recuperar los datos del usuario y el token cuando se recarga la página
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { accessToken, user } = await loginService({ email, password });
      
      // Guardar el token y los datos del usuario en localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error: any) {
      console.error('Error:', error.message);
      throw new Error('Credenciales incorrectas o error en la autenticación');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/auth/signin');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
