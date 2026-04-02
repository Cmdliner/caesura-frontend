import { apiClient } from './client';
import { ENDPOINTS } from '@/lib/constants';
import { setAuth, clearAuth } from '@/lib/utils';

export const authAPI = {

  login: async (email: string, password: string): Promise<API.AuthResponse> => {
    const response = await apiClient.post<API.AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    setAuth(response.data);
    return response.data;
  },

  register: async (
    email: string,
    username: string,
    password: string
  ): Promise<API.AuthResponse> => {
    const response = await apiClient.post<API.AuthResponse>(ENDPOINTS.AUTH.REGISTER, {
      email,
      username,
      password,
      confirmPassword: password,
    });
    setAuth(response.data);
    return response.data;
  },

  googleAuth: async (idToken: string): Promise<API.AuthResponse> => {
    const response = await apiClient.post<API.AuthResponse>(ENDPOINTS.AUTH.GOOGLE, {
      idToken,
    });
    setAuth(response.data);
    return response.data;
  },

  logout: (): void => {
    clearAuth();
  },

  refreshToken: async (): Promise<API.AuthResponse> => {
    const response = await apiClient.post<API.AuthResponse>(ENDPOINTS.AUTH.REFRESH);
    setAuth(response.data);
    return response.data;
  },

  getProfile: async (): Promise<API.UserProfile> => {
    const response = await apiClient.get<{ user: API.UserProfile } | API.UserProfile>(ENDPOINTS.AUTH.PROFILE);
    return 'id' in response.data ? response.data as API.UserProfile : response.data.user;
  },

  updateProfile: async (data: Partial<API.User>): Promise<API.UserProfile> => {
    const response = await apiClient.patch<{ user: API.UserProfile }>(ENDPOINTS.AUTH.PROFILE, data);
    return response.data.user;
  },
};