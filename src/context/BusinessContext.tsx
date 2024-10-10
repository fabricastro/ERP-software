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
      // Aquí podrías hacer una llamada a una API para obtener los datos
      const businessData = {
        name: "Daes Ingeniería",
        address: "LEMOS E/ 5 Y 6 LOTE 34 ",
        phone: "264-5591009",
        email: "ehererra@daesingenieria.com",
        website: "daesingenieria.com.ar",
        logo: "http://localhost:5173/public/DAES_INGENIERIA.webp",
      };
      setBusiness(businessData);
    };

    fetchBusinessData();
  }, []);

  return (
    <BusinessContext.Provider value={business}>
      {children}
    </BusinessContext.Provider>
  );
};
