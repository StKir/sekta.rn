import { AxiosError } from 'axios';

import { ApiError, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './types';
import { api, apiClient } from './apiClient';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await api.post<RegisterResponse>('/register', data);

      if (response.data.accessToken) {
        apiClient.setToken(response.data.accessToken);
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || 'Ошибка регистрации');
    }
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/login', data);

      if (response.data.accessToken) {
        apiClient.setToken(response.data.accessToken);
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;

      if (axiosError.response?.status === 404) {
        throw new Error('Пользователь не найден');
      }

      throw new Error(axiosError.response?.data?.message || 'Ошибка авторизации');
    }
  },

  logout: () => {
    apiClient.clearToken();
  },
};
