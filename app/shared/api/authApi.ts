import { AxiosError } from 'axios';

import {
  ApiError,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  MeResponse,
} from './types';
import { api, apiClient } from './apiClient';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await api.post<RegisterResponse>('/register', data);

      if (response.data.token) {
        apiClient.setToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          'Ошибка регистрации'
      );
    }
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/login', data);

      if (response.data.token) {
        apiClient.setToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;

      if (axiosError.response?.status === 404) {
        throw new Error('Пользователь не найден');
      }

      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          'Ошибка авторизации'
      );
    }
  },

  getUserMe: async (): Promise<MeResponse> => {
    try {
      const response = await api.get<MeResponse>('/user/me');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          'Ошибка получения данных пользователя'
      );
    }
  },

  logout: () => {
    apiClient.clearToken();
  },
};
