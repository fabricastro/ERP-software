import { BaseService } from './BaseService';

class ArticleService extends BaseService {
  
  constructor() {
    super(import.meta.env.VITE_API_URL); 
  }

  // Método para agregar un artículo
  async addArticle(data: {
    type: string;
    categoryId: number;
    name: string;
    status: string;
    description: string;
    sku: string;
    barcode: string;
    internalCost: number;
    profitability: number;
    unitPrice: number;
    iva: number;
    providerId: number;
    observations?: string;
    stock: number;
  }) {
    return this.post('/article', data);
  }

  // Método para obtener todos los artículos
  getAll() {
    return this.get('/article');
  }

  // Método para obtener un artículo por ID
  getById(id: number) {
    return this.get(`/article/${id}`);
  }

  // Método para filtrar artículos con `findIn`
   findArticles(
    filter: Record<string, any>,
    page: number = 1,
    limit: number = 10,
    order: { column: string; typeOrder: 'ASC' | 'DESC' } = { column: 'name', typeOrder: 'ASC' }
  ) {
    return this.findIn('article', filter, page, limit, order);
  }
  
  // Método para actualizar un artículo
  async updateArticle(id: number, data: {
    type?: string;
    categoryId?: number;
    name?: string;
    status?: string;
    description?: string;
    sku?: string;
    barcode?: string;
    internalCost?: number;
    profitability?: number;
    unitPrice?: number;
    iva?: number;
    providerId?: number;
    observations?: string;
    stock?: number;
  }) {
    return this.patch(`/article/${id}`, data);
  }

  // Método para eliminar un artículo
  async deleteArticle(id: string) {
    return this.delete(`/article/${id}`);
  }
}

export const articleService = new ArticleService();
