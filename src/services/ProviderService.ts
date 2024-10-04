import { BaseService } from './BaseService';

// Clase específica para el módulo de proveedores
class ProviderService extends BaseService {
  constructor() {
    super(import.meta.env.VITE_API_URL); // URL base de la API
  }

  // Método para agregar un proveedor
  async addProvider(data: {
    type: string;
    name: string;
    cuit: string;
    fiscalAddress: string;
    postalCode: string;
    community: string;
    province: string;
    country: string;
    phone: string;
    email: string;
    web?: string;
  }) {
    return this.post('/provider', data);
  }

  getAll() {
    return this.get('/provider');
  }
  getById(id: number) {
    return this.get(`/provider/${id}`);
  }
  async updateProvider(id: number, data: {
    type?: string;
    name?: string;
    cuit?: string;
    fiscalAddress?: string;
    postalCode?: string;
    community?: string;
    province?: string;
    country?: string;
    phone?: string;
    email?: string;
    web?: string;
  }) {
    return this.patch(`/provider/${id}`, data);
  }
}

export const providerService = new ProviderService();
