import { BaseService } from './BaseService';

// Clase para manejar las facturas (SalesDocs)
class SalesDocsService extends BaseService {
  
  constructor() {
    super(import.meta.env.VITE_API_URL); // URL base de la API
  }

  // Método para agregar una factura
  async addSalesDoc(data: {
    type: string;
    customerId: number;
    state: string;
    paymentMethod: string;
    date: string;
    validityDate: string;
    number: number;
    observations: string;
    net: number;
    iva: number;
    amount: number;
    articles: any[];
  }) {
    return this.post('/salesDocs', data);
  }

  // Obtener todas las facturas
  getAll() {
    return this.get('/salesDocs');
  }

  // Obtener una factura por su ID
  getById(id: number) {
    return this.get(`/salesDocs/${id}`);
  }

  // Actualizar una factura
  async updateSalesDoc(id: number, data: any) {
    return this.patch(`/salesDocs/${id}`, data);
  }

  // Eliminar una factura
  async deleteSalesDoc(id: number) {
    return this.delete(`/salesDocs/${id}`);
  }
}

export const salesDocsService = new SalesDocsService();
