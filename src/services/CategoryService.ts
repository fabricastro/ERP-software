import { Category } from '../interfaces/category';
import { BaseService } from './BaseService';

class CategoryService extends BaseService {
  constructor() {
    super(import.meta.env.VITE_API_URL);
  }

  // Método para agregar una categoría
  async addCategory(data: { name: string; color: string }): Promise<Category> {
    return this.post('/category', data);
  }

  // Método para obtener todas las categorías
  async getAllCategories(): Promise<Category[]> {
    return this.get('/category');
  
  }
  getById(id: number) {
    return this.get(`/category/${id}`);
  }

  async updateCategory(id: number, data: {
    name?: string;
    color?: string;
  }) {
    return this.patch(`/category/${id}`, data);
  }

  async deleteCategory(id: number) {
    return this.delete(`/category/${id}`);
  }
}

export const categoryService = new CategoryService();
