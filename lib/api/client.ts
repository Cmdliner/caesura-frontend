import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/lib/constants';
import { tokenManager } from '@/lib/utils';

export interface APIError {
  message: string;
  status?: number;
  code?: string;
}

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Allow credentials in cross-origin requests
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = tokenManager.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: APIError = {
          message: error.message || 'Unknown error occurred',
          status: error.response?.status,
          code: error.code,
        };

        if (error.response?.data && typeof error.response.data === 'object') {
          const data = error.response.data as Record<string, unknown>;
          if ('error' in data) {
            apiError.message = String(data.error);
          } else if ('message' in data) {
            apiError.message = String(data.message);
          }
        }

        // Log full error details for debugging
        console.error('API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: apiError.message,
          code: error.code,
          baseURL: error.config?.baseURL,
        });

        return Promise.reject(apiError);
      }
    );
  }

  public get<T>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  public post<T>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  public patch<T>(url: string, data?: any, config?: any) {
    return this.client.patch<T>(url, data, config);
  }

  public put<T>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  public delete<T>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new APIClient();
