import apiClient from './apiClient';
import { endpoints } from './endpoints';

export interface Officer {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  photoUrl?: string;
  isActive: boolean;
  branchId?: string;
  branch?: {
    id: number;
    name: string;
    code: string;
  };
  _count?: {
    assignments: number;
  };
}

export interface OfficerFilters {
  search?: string;
  limit?: number;
  page?: number;
}

export const officerService = {
  async getAll(params: OfficerFilters = {}) {
    const response = await apiClient.get(endpoints.officers.list, { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(endpoints.officers.get(id));
    return response.data;
  },

  async create(data: FormData | Partial<Officer>) {
    const isFormData = data instanceof FormData;
    const response = await apiClient.post(endpoints.officers.create, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  async update(id: string, data: FormData | Partial<Officer>) {
    const isFormData = data instanceof FormData;
    const response = await apiClient.patch(`${endpoints.officers.list}/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`${endpoints.officers.list}/${id}`);
    return response.data;
  }
};
