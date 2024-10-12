import { BaseService } from './BaseService';

class CustomerService extends BaseService {
  
  constructor() {
    super(import.meta.env.VITE_API_URL); 
  }

  async addCustomer(data: {
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
    return this.post('/customer', data);
  }

  getAll() {
    return this.get('/customer');
  }
  getById(id: number) {
    return this.get(`/customer/${id}`);
  }
  async updateCustomer(id: number, data: {
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
    return this.patch(`/customer/${id}`, data);
  }

  async deleteCustomer(id: string) {
    return this.delete(`/customer/${id}`);
  }
}

export const customerService = new CustomerService();
