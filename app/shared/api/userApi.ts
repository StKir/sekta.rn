import { AxiosError } from 'axios';

import { ApiError, BalanceResponse, MeResponse } from './types';
import { api } from './apiClient';

export const userApi = {
  getMe: async (): Promise<MeResponse> => {
    try {
      const response = await api.get<MeResponse>('/user/me');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;

      if (axiosError.response?.status === 401) {
        throw new Error('Не авторизован');
      }

      throw new Error(axiosError.response?.data?.message || 'Ошибка получения данных пользователя');
    }
  },

  getBalance: async (): Promise<BalanceResponse> => {
    try {
      const response = await api.get<BalanceResponse>('/user/balance');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;

      if (axiosError.response?.status === 401) {
        throw new Error('Не авторизован');
      }

      throw new Error(axiosError.response?.data?.message || 'Ошибка получения баланса');
    }
  },
};
