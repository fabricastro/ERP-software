import { Customer } from '../interfaces/customer';
import { BaseService } from './BaseService';

class CustomerService extends BaseService {
  
  constructor() {
    super(import.meta.env.VITE_API_URL); 
  }

  async addCustomer(data: Customer): Promise<Customer> {
    return this.post('/customer', data);
  }

  getAll(): Promise<Customer[]> {
    return this.get('/customer');
  }
  getById(id: any): Promise<Customer> {
    return this.get(`/customer/${id}`);
  }
  async updateCustomer(id: any, data: {
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

  async deleteCustomer(id: any) {
    return this.delete(`/customer/${id}`);
  }
}

export const customerService = new CustomerService();
