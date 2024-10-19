import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const URL_API = import.meta.env.VITE_API_URL;

// Definimos la estructura de los datos del negocio
interface Settings {
  legalName: string;
  address: string;
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

  // Cargar datos de la API
  useEffect(() => {
    const fetchSettingsData = async () => {
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
        console.error("Detalles del error:", error.response?.data);
      }
    };
  
    fetchSettingsData();
  }, []);
  

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
