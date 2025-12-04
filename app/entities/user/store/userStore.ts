import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

import { AIModel } from '@/types/aiTypes';
import { StorageService } from '@/shared/utils/storage';
import { UserData } from '@/shared/types/user.types';
import { FormAnswers } from '@/shared/types/form.types';
import { TariffInfo } from '@/shared/api/subscriptionApi';
import { apiClient } from '@/shared/api/apiClient';

interface UserState {
  userData: UserData | null;
  isLoading: boolean;
  ai_tokens: number;
  selectedAIModel: AIModel;
  tariffInfo: TariffInfo | null;

  notification: {
    active: boolean;
    time: Date | null;
  };
  theme: 'light' | 'dark';
  userTime: Date;
  token: string | null;
}

interface UserActions {
  setUser: (userData: UserData | FormAnswers) => void;
  updateUser: (userData: Partial<UserData>) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setNotification: (notification?: { active: boolean; time: Date | null }) => void;
  setTariffInfo: (tariffInfo: TariffInfo) => void;
  removeUser: () => void;
  clearAll: () => void;
  plusAiToken: () => void;
  minusAiToken: () => void;
  setAiTokens: (ai_tokens: number) => void;
  setUserTime: () => void;
  getNotification: () => { active: boolean; time: Date | null };
  setSelectedAIModel: (model: AIModel) => void;
  getSelectedAIModel: () => AIModel;
  setToken: (token: string | null) => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  persist(
    (setState, get) => ({
      userData: null,
      tariffInfo: null,
      isLoading: false,
      theme: 'light',
      ai_tokens: 0,
      selectedAIModel: AIModel.GEMINI_2_5_FLASH,
      notification: {
        active: false,
        time: null,
      },
      userTime: new Date(),
      token: null,

      setUserTime: () => {
        setState({ userTime: new Date() });
        StorageService.setUserTime(new Date());
      },

      setUser: (userData: UserData | FormAnswers) => {
        const currentUser = get().userData;
        const userWithDate: UserData = {
          ...(currentUser || {}),
          ...userData,
          registrationDate:
            userData.registrationDate || currentUser?.registrationDate || new Date().toISOString(),
        };

        StorageService.setUser(userWithDate as FormAnswers);

        const tariff_info = (userWithDate as any).tariff_info;

        setState((state) => ({
          userData: userWithDate,
          tariffInfo: tariff_info || state.tariffInfo,
          isLoading: false,
        }));
      },

      getNotification: () => {
        return get().notification;
      },

      setTheme: (theme: 'light' | 'dark') => {
        setState({ theme });
        StorageService.setTheme(theme);
      },

      plusAiToken: () => {
        setState((state) => ({ ai_tokens: state.ai_tokens + 1 }));
        StorageService.setAiToken(get().ai_tokens + 1);
      },

      minusAiToken: () => {
        const tokens = get().ai_tokens;
        if (tokens) {
          StorageService.setAiToken(tokens - 1);
          setState((state) => ({ ai_tokens: state.ai_tokens - 1 }));
        }
      },

      setAiTokens: (ai_tokens: number) => {
        setState({ ai_tokens });
        StorageService.setAiToken(ai_tokens);
      },

      setTariffInfo: (tariffInfo: TariffInfo) => {
        setState({ tariffInfo });
        StorageService.setTariffInfo(tariffInfo);
      },

      setNotification: (notification?: { active: boolean; time: Date | null }) => {
        if (!notification) {
          return;
        }

        const notificationToSave = {
          active: Boolean(notification?.active),
          time: notification?.time ? notification.time : null,
        };

        setState({ notification: notificationToSave });
        StorageService.setNotification(notificationToSave);
      },

      updateUser: (updatedData: Partial<UserData>) => {
        const currentUser = get().userData;
        if (currentUser) {
          const updatedUser: UserData = { ...currentUser, ...updatedData };

          StorageService.setUser(updatedUser as FormAnswers);

          setState({
            userData: updatedUser,
          });
        } else {
          const newUser: UserData = updatedData as UserData;
          StorageService.setUser(newUser as FormAnswers);
          setState({
            userData: newUser,
          });
        }
      },

      removeUser: () => {
        StorageService.removeUser();
        setState({
          userData: null,
          isLoading: false,
        });
      },

      clearAll: () => {
        StorageService.removeUser();
        StorageService.removeItem('auth_token');
        setState({
          userData: null,
          token: null,
          isLoading: false,
        });
      },

      setSelectedAIModel: (model: AIModel) => {
        setState({ selectedAIModel: model });
        StorageService.setSelectedAIModel(model);
      },

      getSelectedAIModel: () => {
        return get().selectedAIModel;
      },

      setToken: (token: string | null) => {
        if (token) {
          StorageService.setItem('auth_token', token);
          apiClient.setToken(token);
        } else {
          StorageService.removeItem('auth_token');
          apiClient.clearToken();
        }
        setState({ token });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => ({
        getItem: (_name) => {
          const userData = StorageService.getUser();
          const theme = StorageService.getTheme();
          const ai_tokens = StorageService.getAiToken();
          const notification = StorageService.getNotification();
          const selectedAIModel = StorageService.getSelectedAIModel() || AIModel.GEMINI_2_5_FLASH;
          const token = StorageService.getItem('auth_token');

          return JSON.stringify({
            state: {
              userData: userData as UserData,
              isLoading: false,
              theme: theme as 'light' | 'dark',
              ai_tokens: ai_tokens,
              notification: notification,
              selectedAIModel: selectedAIModel,
              token: token,
            },
          });
        },
        setItem: (name, value) => {
          const parsed = JSON.parse(value);
          if (parsed.state?.userData) {
            StorageService.setUser(parsed.state.userData as FormAnswers);
          }
          if (parsed.state?.selectedAIModel) {
            StorageService.setSelectedAIModel(parsed.state.selectedAIModel);
          }
          if (parsed.state?.token) {
            StorageService.setItem('auth_token', parsed.state.token);
            apiClient.setToken(parsed.state.token);
          }
        },
        removeItem: () => {
          StorageService.removeUser();
          StorageService.removeItem('auth_token');
        },
      })),
    }
  )
);
