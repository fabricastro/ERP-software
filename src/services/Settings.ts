import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL;

interface SettingsParams {
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  numberAccount: string;
  nextBillId: number;
  nextBudgetId: number;
}

export const updateSettingsService = async (data: SettingsParams): Promise<any> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado. No estás autenticado.');
    }

    const response = await axios.patch(`${URL_API}/settings`, data, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar la información de la empresa');
  }
};
