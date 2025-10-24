import { AxiosError } from 'axios';

import {
  AddTokensRequest,
  AddTokensResponse,
  ApiError,
  SpendTokensRequest,
  SpendTokensResponse,
} from './types';
import { api } from './apiClient';

export const tokensApi = {
  addTokens: async (data: AddTokensRequest): Promise<AddTokensResponse> => {
    try {
      const response = await api.post<AddTokensResponse>('/tokens/add', data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;

      if (axiosError.response?.status === 400) {
        throw new Error('Некорректные параметры');
      }

      if (axiosError.response?.status === 404) {
        throw new Error('Пользователь не найден');
      }

      throw new Error(axiosError.response?.data?.message || 'Ошибка добавления токенов');
    }
  },

  spendTokens: async (data: SpendTokensRequest): Promise<SpendTokensResponse> => {
    try {
      const response = await api.post<SpendTokensResponse>('/tokens/spend', data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;

      if (axiosError.response?.status === 400) {
        throw new Error('Недостаточно токенов');
      }

      if (axiosError.response?.status === 401) {
        throw new Error('Не авторизован');
      }

      throw new Error(axiosError.response?.data?.message || 'Ошибка списания токенов');
    }
  },
};
