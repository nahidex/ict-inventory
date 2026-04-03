import apiClient from './apiClient';

export interface Asset {
  id: number;
  assetTag: string;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  status: string;
  imageUrl?: string | null;
  initialImageUrl?: string | null;
  categoryId: number | null;
  branchId: number;
  currentOfficerId: number | null;
  category?: {
    id: number;
    name: string;
    code: string;
  };
  assignments?: Array<{
    id: number;
    issueDate: string;
    officer?: {
      id: number;
      name: string;
    };
  }>;
}

export interface AssetListResponse {
  data: Asset[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const assetService = {
  getAll: async (page = 1, limit = 10, search = '', categoryId = '', status = ''): Promise<AssetListResponse> => {
    let url = `/assets?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  getById: async (id: number | string): Promise<Asset> => {
    const response = await apiClient.get(`/assets/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<Asset> => {
    const response = await apiClient.post('/assets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number | string, formData: FormData): Promise<Asset> => {
    const response = await apiClient.patch(`/assets/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(`/assets/${id}`);
  },
};
