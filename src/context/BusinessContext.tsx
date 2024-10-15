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
                name: "Daes Ingeniería",
                address: "LEMOS E/ 5 Y 6 LOTE 34 ",
                phone: "264-5591009",
                email: "ehererra@daesingenieria.com",
                website: "daesingenieria.com.ar",
                logo: "http://localhost:5173/logo.png",
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
