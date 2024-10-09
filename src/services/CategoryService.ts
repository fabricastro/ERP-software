import { BaseService } from './BaseService';

class CategoryService extends BaseService {
  constructor() {
    super(import.meta.env.VITE_API_URL);
  }

  // Método para agregar una categoría
  async addCategory(data: { name: string; color: string }) {
    return this.post('/category', data);
  }

  // Método para obtener todas las categorías
  async getAllCategories() {
    return this.get('/category');
  }
}

export const categoryService = new CategoryService();
