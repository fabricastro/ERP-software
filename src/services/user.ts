import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL;

interface UpdateUserParams {
  bussinessName: string;
  email: string;
  phone: string;
  password?: string;
}

export const updateUserService = async (id: number, userData: UpdateUserParams): Promise<any> => {
  try {
    console.log(userData);
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado. No estás autenticado.');
    }

    const response = await axios.patch(`${URL_API}/user/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    const user = { ...JSON.parse(localStorage.getItem('user') || '{}'), ...userData };
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el usuario');
  }
};
