import { apiClient } from './apiClient';
import { endpoints } from './endpoints';

export const authService = {
  async login(credentials: any) {
    const response = await apiClient.post(endpoints.auth.login, credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('isAuthenticated', 'true');
    }
    return response;
  },

  async register(data: any) {
    return await apiClient.post(endpoints.auth.register, data);
  },

  async getMe() {
    return await apiClient.get(endpoints.auth.me);
  },

  async logout() {
    await apiClient.post(endpoints.auth.logout, {});
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
