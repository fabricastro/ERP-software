import React, { createContext, useContext, useState, useEffect } from 'react';

// Definimos la estructura de los datos del negocio
interface Business {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
}

const BusinessContext = createContext<Business | null>(null);

// Hook para usar el contexto de Business
export const useBusiness = () => useContext(BusinessContext);

export const BusinessProvider: React.FC = ({ children }) => {
  const [business, setBusiness] = useState<Business | null>(null);

  // Simulación de carga de datos de una API o localStorage
  useEffect(() => {
    const fetchBusinessData = async () => {
        try {
            const businessData = {
                name: "Agencia Technodevs",
                address: "Jorge Bergallo",
                phone: "264-4412511",
                email: "fcastro@technodevs.com",
                website: "technodevs.com.ar",
                logo: "http://localhost:5173/logohorizontal.png",
            };
            console.log('Datos del negocio cargados:', businessData);
            setBusiness(businessData);
        } catch (error) {
            console.error('Error al cargar los datos del negocio:', error);
        }
    };

    fetchBusinessData();
}, []);


  return (
    <BusinessContext.Provider value={business}>
      {children}
    </BusinessContext.Provider>
  );
};
