import { apiClient } from './apiClient';
import { endpoints } from './endpoints';

export interface Assignment {
  id: number;
  assetId: number;
  officerId: number;
  issueDate: string;
  actualReturnDate: string | null;
  returnCondition: string | null;
  returnImageUrl: string | null;
  comments: string | null;
  issuedBy: string | null;
  asset: {
    id: number;
    assetTag: string;
    brand: string;
    model: string;
    status: string;
  };
  officer: {
    id: number;
    name: string;
    designation: string;
    department: string | null;
    photoUrl: string | null;
  };
}

export const assignmentService = {
  getAll: async (): Promise<Assignment[]> => {
    const response = await apiClient.get(endpoints.assignments.list);
    return response.data;
  },

  getById: async (id: string | number): Promise<Assignment> => {
    const response = await apiClient.get(endpoints.assignments.get(id.toString()));
    return response.data;
  },

  issue: async (data: any) => {
    const response = await apiClient.post(endpoints.assignments.issue, data);
    return response.data;
  },

  return: async (id: string | number, data: FormData) => {
    const response = await apiClient.post(endpoints.assignments.return(id.toString()), data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

