import axios, { AxiosInstance } from 'axios';

export class BaseService {
    protected api: AxiosInstance;

    constructor(baseURL: string) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // token de autenticación
            },
        });
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
