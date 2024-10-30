import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginService } from '../services/login';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/token';

interface AuthContextProps {
  user: any;
  isAuthenticated: boolean;
  loadingAuth: boolean;
  setUser: (user: any) => void;
  login: (email: string, password?: string, token?: string) => Promise<void>;
  logout: () => void;
  verifyPassword: (password: string) => Promise<boolean>;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true); // Nuevo estado de carga para autenticación

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      if (!isTokenExpired(token)) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } else {
        logout();
      }
    }

    setLoadingAuth(false); // Indicar que la verificación de autenticación ha terminado
  }, []);

  const login = async (email: string, password?: string, token?: string) => {
    try {
      const credentials = token ? { email, token } : { email, password };
      const { accessToken, user } = await loginService(credentials);
      
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

  const verifyPassword = async (password: string) => {
    if (!user?.email) return false;
    try {
      await loginService({ email: user.email, password }); // Intenta autenticar con el email y password
      return true; // Si tiene éxito, la contraseña es correcta
    } catch {
      return false; // Si falla, la contraseña es incorrecta
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/signin');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, loadingAuth, login, logout, verifyPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
