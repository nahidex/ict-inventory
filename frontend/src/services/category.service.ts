import apiClient from './apiClient';

export interface Category {
  id: number;
  name: string;
  code: string;
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    // The API might return { data: [...] } or just [...]
    return Array.isArray(response.data) ? response.data : response.data.data;
  },
};
