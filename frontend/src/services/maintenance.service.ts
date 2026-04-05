import apiClient from './apiClient';

export interface MaintenanceRecord {
  id: number;
  asset_id: number;
  officer_id?: number;
  issue_description: string;
  repair_cost: number;
  vendor_name?: string;
  sent_date: string;
  receive_date?: string;
  repair_status: 'Pending' | 'Completed' | 'Unrepairable' | 'In Progress';
  asset?: {
    assetTag: string;
    brand: string;
    model: string;
  };
  officer?: {
    name: string;
  };
}

const maintenanceService = {
  getAll: async () => {
    const response = await apiClient.get('/maintenances');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/maintenances/${id}`);
    return response.data;
  },

  createRequest: async (data: any) => {
    const response = await apiClient.post('/maintenances/request', data);
    return response.data;
  },

  complete: async (id: number, data: any) => {
    const response = await apiClient.put(`/maintenances/receive/${id}`, data);
    return response.data;
  },

  getHistoryByAsset: async (assetId: number) => {
    const response = await apiClient.get(`/maintenances/history/${assetId}`);
    return response.data;
  }
};

export default maintenanceService;
