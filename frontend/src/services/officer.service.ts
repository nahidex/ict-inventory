import apiClient from "./apiClient";
import { endpoints } from "./endpoints";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const UPLOADS_BASE_URL = API_BASE_URL.replace("/api", "");

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

const mapOfficerImages = (officer: any): Officer => {
  if (!officer) return officer;

  let photo = officer.photoUrl;

  // Handle relative backend paths
  if (photo && photo.startsWith("/uploads/")) {
    photo = `${UPLOADS_BASE_URL}${photo}`;
  }
  // Handle paths that might not have leading slash but aren't URLs
  else if (photo && !photo.startsWith("http") && !photo.startsWith("data:")) {
    photo = `${UPLOADS_BASE_URL}/${photo}`;
  }

  return { ...officer, photoUrl: photo };
};

export const officerService = {
  async getAll(params: OfficerFilters = {}) {
    const response = await apiClient.get(endpoints.officers.list, { params });
    if (Array.isArray(response.data)) {
      return response.data.map(mapOfficerImages);
    }
    if (response.data.data && Array.isArray(response.data.data)) {
      return {
        ...response.data,
        data: response.data.data.map(mapOfficerImages),
      };
    }
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(endpoints.officers.get(id));
    return mapOfficerImages(response.data);
  },

  async getProfile() {
    const response = await apiClient.get('/officers/profile');
    return response.data;
  },

  async create(data: FormData | Partial<Officer>) {
    const isFormData = data instanceof FormData;
    const response = await apiClient.post(endpoints.officers.create, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return mapOfficerImages(response.data);
  },

  async update(id: string, data: FormData | Partial<Officer>) {
    const isFormData = data instanceof FormData;
    const response = await apiClient.patch(
      endpoints.officers.update(id),
      data,
      {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      },
    );
    return mapOfficerImages(response.data);
  },

  async delete(id: string) {
    const response = await apiClient.delete(endpoints.officers.delete(id));
    return response.data;
  },

  async transfer(
    id: string,
    data: {
      newBranchId: number;
      assetsToCarry: number[];
      assetsToLeave: number[];
    },
  ) {
    const response = await apiClient.patch(
      endpoints.officers.get(id) + "/transfer",
      data,
    );
    return response.data;
  },
};
