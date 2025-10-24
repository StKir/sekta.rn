import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { StorageService } from '@/shared/utils/storage';
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
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
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
