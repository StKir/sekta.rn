import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { StorageService } from '@/shared/utils/storage';
import { Metrics } from '@/shared/utils/metrics';
import { API_URL } from '@/env';

class ApiClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_URL,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Ensure token is hydrated from storage on cold start
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
        }

        const endpoint = error.config?.url || 'unknown';
        const method = error.config?.method?.toUpperCase() || 'unknown';
        const statusCode = error.response?.status;
        const errorMessage =
          (error.response?.data as any)?.message ||
          (error.response?.data as any)?.error ||
          error.message ||
          'Unknown error';

        if (statusCode && statusCode >= 500) {
          Metrics.reportApiError(endpoint, method, statusCode, errorMessage, {
            error_type: 'server_error',
          });
        } else if (statusCode && statusCode >= 400 && statusCode < 500) {
          Metrics.reportApiError(endpoint, method, statusCode, errorMessage, {
            error_type: 'client_error',
          });
        } else if (!error.response) {
          Metrics.reportApiError(endpoint, method, undefined, errorMessage, {
            error_type: 'network_error',
            timeout: error.code === 'ECONNABORTED' ? 'true' : 'false',
          });
        }

        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    StorageService.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    StorageService.removeItem('auth_token');
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = StorageService.getItem('auth_token');
    }
    return this.token;
  }

  getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const apiClient = new ApiClient();
export const api = apiClient.getInstance();
