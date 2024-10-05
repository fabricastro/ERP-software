import axios, { AxiosInstance } from 'axios';
import { useNavigate } from 'react-router-dom';

export class BaseService {
    protected api: AxiosInstance;
    protected navigate: ReturnType<typeof useNavigate>;
    protected setAlert: (type: 'success' | 'warning' | 'error', title: string, message: string) => void;

    constructor(baseURL: string) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    this.handleUnauthorizedError();
                }
                return Promise.reject(error);
            }
        );
    }

    setNavigate(navigate: ReturnType<typeof useNavigate>) {
        this.navigate = navigate;
    }

    setAlertFunction(setAlert: (type: 'success' | 'warning' | 'error', title: string, message: string) => void) {
        this.setAlert = setAlert;
    }

    handleUnauthorizedError() {
        localStorage.removeItem('token');

        this.setAlert('error', 'Sesión Expirada', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');

        this.navigate('/signin');
    }

    // Método para obtener datos (GET)
    async get<T>(url: string, params?: any): Promise<T> {
        try {
            const response = await this.api.get<T>(url, { params });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error en la solicitud');
        }
    }

    // Método para crear (POST)
    async post<T>(url: string, data: any): Promise<T> {
        try {
            const response = await this.api.post<T>(url, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error en la solicitud');
        }
    }

    // Método para actualizar (PATCH)
    async patch<T>(url: string, data: any): Promise<T> {
        try {
            const response = await this.api.patch<T>(url, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error en la solicitud');
        }
    }

    // Método para eliminar (DELETE)
    async delete<T>(url: string): Promise<T> {
        try {
            const response = await this.api.delete<T>(url);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error en la solicitud');
        }
    }
}
