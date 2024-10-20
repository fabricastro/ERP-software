import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL;

// Definir la interfaz para los parámetros de inicio de sesión
interface LoginParams {
  email: string;
  password: string;
}
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
  };
}

// Servicio de login
export const loginService = async ({ email, password }: LoginParams): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${URL_API}/auth/signin`, {
      email: String(email),
      password: String(password)
    });

    
    if (!response.data.accessToken) {
      throw new Error('No se recibió el token de acceso');
    }

    return response.data;
  } catch (error: any) {
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de red');
    }

    
    if (error.response?.status === 401) {
      throw new Error('Credenciales incorrectas o error en la autenticación');
    }

    
    throw new Error(
      error.response?.data?.message[0]?.msg || error.response?.data?.message || 'Login fallido'
    );
  }
};
