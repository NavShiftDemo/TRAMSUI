import api from './api';
import { ApiResponse, User } from '../types';

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
