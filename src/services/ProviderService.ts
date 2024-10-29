import { Provider } from '../interfaces/provider';
import { BaseService } from './BaseService';

class ProviderService extends BaseService {
  
  constructor() {
    super(import.meta.env.VITE_API_URL); 
  }

  async addProvider(data: Provider): Promise<Provider> {
    return this.post('/provider', data);
  }

  getAll(): Promise<Provider[]> {
    return this.get('/provider');
  }
  getById(id: any): Promise<Provider> {
    return this.get(`/provider/${id}`);
  }

  async updateProvider(id: any, data: {
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
    return this.patch(`/provider/${Number(id)}`, data);
  }

  async deleteProvider(id: any) {
    return this.delete(`/provider/${id}`);
  }
}

export const providerService = new ProviderService();
