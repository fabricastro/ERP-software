import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL;

interface UpdateUserParams {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export const updateUserService = async (id: number, userData: UpdateUserParams): Promise<any> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado. No estás autenticado.');
    }

    const response = await axios.patch(`${URL_API}/user/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    const user = { ...JSON.parse(localStorage.getItem('user') || '{}'), ...response.data };
    
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el usuario');
  }
};

export const recoveryPassword = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(`${URL_API}/auth/recovery`, { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al solicitar la recuperación de contraseña');
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<any> => {
  try {
      const response = await axios.post(`${URL_API}/auth/reset-password`, {
          token,
          newPassword,
      });
      return response.data;
  } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al restablecer la contraseña.');
  }

};
