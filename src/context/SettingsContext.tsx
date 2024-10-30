import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Importa useAuth

const URL_API = import.meta.env.VITE_API_URL;

// Definimos la estructura de los datos del negocio
interface Settings {
  bussinessName: string;
  address: string;
  cuit: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  numberAccount: string;
  nextBillId: number;
  nextBudgetId: number;
}

interface SettingsContextProps {
  settings: Settings | null;
  setSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
  loading: boolean;
  error: string | null;
  fetchUpdatedSettings: () => Promise<void>; 
  isBusinessInfoComplete: () => boolean;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

// Hook para usar el contexto de Settings
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  const { isAuthenticated, loadingAuth } = useAuth(); // Usa useAuth para acceder al estado de autenticación

  // Función para obtener los settings actualizados desde el backend
  const fetchUpdatedSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado. No estás autenticado.');
      }

      const response = await axios.get(`${URL_API}/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSettings(response.data);
    } catch (error: any) {
      console.error('Error al obtener los settings actualizados:', error);
      setError('Error al actualizar los settings');
    }
  };

  // Cargar los datos iniciales solo si el usuario está autenticado
  useEffect(() => {
    const fetchSettingsData = async () => {
      if (!isAuthenticated || loadingAuth) return; // Solo ejecuta si el usuario está autenticado

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token no encontrado. No estás autenticado.');
        }

        const response = await axios.get(`${URL_API}/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSettings(response.data);
      } catch (error: any) {
        setError('Error al cargar los datos de configuración');
        console.error('Detalles del error:', error.response?.data || error.message);
      } finally {
        setLoading(false); // Finaliza la carga, haya éxito o error
      }
    };

    fetchSettingsData();
  }, [isAuthenticated, loadingAuth]); // Ejecuta solo cuando isAuthenticated y loadingAuth cambien

   // Verifica si los campos clave de Información empresarial están completos
   const isBusinessInfoComplete = () => {
    const { bussinessName, address, cuit, phone, email } = settings || {};
    const complete = Boolean(bussinessName && address && cuit && phone && email);
    console.log("isBusinessInfoComplete:", complete); // Añadir este log
    return complete;
  };
  

  return (
    <SettingsContext.Provider value={{ settings, setSettings, loading, error, fetchUpdatedSettings, isBusinessInfoComplete  }}>
      {children}
    </SettingsContext.Provider>
  );
};
