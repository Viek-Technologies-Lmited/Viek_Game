import axiosInstance from '../lib/axios';
import type { UserProfile } from '@viekplay/shared-types';

export const authService = {
  login: async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post<{
      access_token: string;
      user: UserProfile;
    }>('/auth/login', data);
    return response.data;
  },

  register: async (data: { email: string; password: string; displayName: string }) => {
    // Note: The backend expects 'name', not 'displayName' currently in docs, but the existing type expects displayName. Let's send what the backend expects, which is 'name', or 'username'.
    // Adjusting payload to match our backend structure: { email, password, name, username }
    const response = await axiosInstance.post<{
      access_token: string;
      user: UserProfile;
    }>('/auth/register', {
      email: data.email,
      password: data.password,
      name: data.displayName,
      username: data.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000), // Simple username generator for now
    });
    return response.data;
  },

  getMe: async () => {
    const response = await axiosInstance.get<UserProfile>('/auth/me');
    return response.data;
  },
};
