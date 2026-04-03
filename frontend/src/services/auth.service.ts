import apiClient from './apiClient';
import { endpoints } from './endpoints';

export const authService = {
  async login(credentials: any) {
    const response = await apiClient.post(endpoints.auth.login, credentials);
    return response.data;
  },

  async register(data: any) {
    const response = await apiClient.post(endpoints.auth.register, data);
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get(endpoints.auth.me);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
