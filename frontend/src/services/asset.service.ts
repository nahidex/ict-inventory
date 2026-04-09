import apiClient from './apiClient';
import { config } from '../utils/config';

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

const API_BASE_URL = `${config.apiUrl}/api`;
const UPLOADS_BASE_URL = config.apiUrl;

interface RawAsset extends Omit<Asset, 'initialImageUrl' | 'imageUrl'> {
  initialImageUrl?: string | null;
  imageUrl?: string | null;
}

const mapAssetImages = (asset: RawAsset): Asset => ({
  ...asset,
  initialImageUrl: asset.initialImageUrl ? (asset.initialImageUrl.startsWith('http') ? asset.initialImageUrl : `${UPLOADS_BASE_URL}${asset.initialImageUrl}`) : null,
  imageUrl: asset.imageUrl ? (asset.imageUrl.startsWith('http') ? asset.imageUrl : `${UPLOADS_BASE_URL}${asset.imageUrl}`) : null,
});

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
    const data = response.data;
    return {
      ...data,
      data: data.data.map(mapAssetImages)
    };
  },

  getById: async (id: number | string): Promise<Asset> => {
    const response = await apiClient.get(`/assets/${id}`);
    return mapAssetImages(response.data);
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
