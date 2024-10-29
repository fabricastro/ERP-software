import { Article } from '../interfaces/article';
import { BaseService } from './BaseService';

class ArticleService extends BaseService {
  
  constructor() {
    super(import.meta.env.VITE_API_URL); 
  }

  // Método para agregar un artículo
  async addArticle(data: Article): Promise<Article> {
    return this.post('/article', data);
  }

  // Método para obtener todos los artículos
  getAll(): Promise<Article[]> {
    return this.get('/article');
  }

  // Método para obtener un artículo por ID
  getById(id: any): Promise<Article> {
    return this.get(`/article/${id}`);
  }
  
  // Método para actualizar un artículo
  async updateArticle(id: any, data: Article) {
    return this.patch(`/article/${id}`, data);
  }

  // Método para eliminar un artículo
  async deleteArticle(id: any) {
    return this.delete(`/article/${id}`);
  }
}

export const articleService = new ArticleService();
