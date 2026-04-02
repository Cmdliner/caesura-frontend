import { apiClient } from './client';
import { ENDPOINTS } from '@/lib/constants';
import { setAuth, clearAuth } from '@/lib/utils';

/**
 * Auth API Functions
 */

export const authAPI = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<API.AuthResponse> => {
    const response = await apiClient.post<API.AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    setAuth(response.data);
    return response.data;
  },

  /**
   * Register a new account
   */
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

  /**
   * Login/Register with Google
   */
  googleAuth: async (idToken: string): Promise<API.AuthResponse> => {
    const response = await apiClient.post<API.AuthResponse>(ENDPOINTS.AUTH.GOOGLE, {
      idToken,
    });
    setAuth(response.data);
    return response.data;
  },

  /**
   * Logout
   */
  logout: (): void => {
    clearAuth();
  },

  /**
   * Refresh auth token
   */
  refreshToken: async (): Promise<API.AuthResponse> => {
    const response = await apiClient.post<API.AuthResponse>(ENDPOINTS.AUTH.REFRESH);
    setAuth(response.data);
    return response.data;
  },

  /**
   * Get current user's profile
   */
  getProfile: async (): Promise<API.UserProfile> => {
    const response = await apiClient.get<{ user: API.UserProfile } | API.UserProfile>(ENDPOINTS.AUTH.PROFILE);
    return 'id' in response.data ? response.data as API.UserProfile : response.data.user;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<API.User>): Promise<API.UserProfile> => {
    const response = await apiClient.patch<{ user: API.UserProfile }>(ENDPOINTS.AUTH.PROFILE, data);
    return response.data.user;
  },
};
