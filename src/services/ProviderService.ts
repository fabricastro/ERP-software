import { BaseService } from './BaseService';

class ProviderService extends BaseService {
  
  constructor() {
    super(import.meta.env.VITE_API_URL); 
  }

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

  async deleteProvider(id: string) {
    return this.delete(`/provider/${id}`);
  }
}

export const providerService = new ProviderService();
