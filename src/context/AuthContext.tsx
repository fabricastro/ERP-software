import React, { createContext, useContext, useState } from 'react';
import { loginService } from '../services/login';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token'); 
  });

  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const { accessToken } = await loginService({ email, password });
      
      localStorage.setItem('token', accessToken);

      setIsAuthenticated(true);
      navigate('/');
    } catch (error: any) {
      console.error('Error:', error.message);
      throw new Error('Credenciales incorrectas o error en la autenticación');
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); 
    setIsAuthenticated(false);
    navigate('/auth/signin'); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
