import { AxiosError } from 'axios';

import { api, apiClient } from './apiClient';

export interface TariffInfo {
  status: 'TRIAL' | 'PRO';
  trialCount?: number;
  start?: string;
  end?: string;
}

export interface User {
  email: string;
  name: string;
  birthDate: string;
  gender: string;
  registrationDate: string;
  tariff_info: TariffInfo;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  birthDate: string;
  gender: string;
}

export interface RegisterResponse {
  token: string;
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface CheckAccessResponse {
  hasAccess: boolean;
  tariff_info?: TariffInfo;
  remainingTrials?: number;
  reason?: string;
}

export interface ActivateSubscriptionRequest {
  duration: string;
}

export interface Transaction {
  id: string;
  userId: string;
  duration: string;
  description: string;
  createdAt: string;
  paymentId: string;
}

export interface ActivateSubscriptionResponse {
  success: boolean;
  duration: '1month' | '3months' | '1year';
  message: string;
  paymentUrl: string;
}

export interface ApiError {
  error: string;
}

export const subscriptionApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await api.post<RegisterResponse>('/register', data);

      if (response.data.token) {
        apiClient.setToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.error || 'Ошибка регистрации');
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

      if (axiosError.response?.status === 401) {
        throw new Error('Неверный пароль');
      }

      throw new Error(axiosError.response?.data?.error || 'Ошибка авторизации');
    }
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    try {
      const response = await api.get<{ user: User }>('/user/me');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;

      throw new Error(axiosError.response?.data?.error || 'Ошибка получения данных пользователя');
    }
  },

  checkAccess: async (): Promise<CheckAccessResponse> => {
    try {
      const response = await api.post<CheckAccessResponse>('/subscription/check-access');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.error || 'Ошибка проверки доступа');
    }
  },

  activateSubscription: async (
    data: ActivateSubscriptionRequest
  ): Promise<ActivateSubscriptionResponse> => {
    try {
      const response = await api.post<ActivateSubscriptionResponse>('/subscription/activate', data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.error || 'Ошибка активации подписки');
    }
  },

  logout: () => {
    apiClient.clearToken();
  },
};
