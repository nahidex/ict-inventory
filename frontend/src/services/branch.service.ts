import apiClient from './apiClient';
import { endpoints } from './endpoints';

export interface Branch {
  id: string;
  name: string;
  code: string;
  location?: string;
  _count?: {
    assets: number;
    officers: number;
  };
}

export const branchService = {
  async getAll() {
    const response = await apiClient.get(endpoints.branches.list);
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(endpoints.branches.get(id));
    return response.data;
  },

  async create(data: Partial<Branch>) {
    const response = await apiClient.post(endpoints.branches.create, data);
    return response.data;
  },

  async update(id: string, data: Partial<Branch>) {
    const response = await apiClient.patch(endpoints.branches.update(id), data);
    return response.data;
  },

  async getBranchAssets(id: string) {
    const response = await apiClient.get(endpoints.branches.assets(id));
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(endpoints.branches.delete(id));
    return response.data;
  }
};
