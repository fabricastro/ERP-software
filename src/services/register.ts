import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL;

interface RegisterParams {
  name: string;
  email: string;
  phone: string;
}

export const registerService = async ({ name, email, phone }: RegisterParams): Promise<any> => {
  try {
    const response = await axios.post(`${URL_API}/auth/signup`, {
      name,
      email,
      phone,
    });
    return response.data;
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de red');
    }
    throw new Error(
      error.response?.data?.message?.[0]?.msg || error.response?.data?.message || error.message || 'Error en la solicitud'
    );
  }
};
