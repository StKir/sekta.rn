/* eslint-disable no-console */
import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

import { AIModel } from '@/types/aiTypes';
import { StorageService } from '@/shared/utils/storage';
import { UserData } from '@/shared/types/user.types';
import { FormAnswers } from '@/shared/types/form.types';
import { apiClient } from '@/shared/api/apiClient';

interface UserState {
  userData: UserData | null;
  isLoading: boolean;
  ai_tokens: number;
  selectedAIModel: AIModel;

  notification: {
    active: boolean;
    time: Date | null;
  };
  theme: 'light' | 'dark';
  userTime: Date;
  token: string | null;
  isAuthenticated: boolean;
}

interface UserActions {
  setUser: (userData: UserData | FormAnswers) => void;
  updateUser: (userData: Partial<UserData>) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setNotification: (notification?: { active: boolean; time: Date | null }) => void;
  loadUser: () => void;
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
  setAuthenticated: (isAuthenticated: boolean) => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  persist(
    (setState, get) => ({
      userData: null,
      isLoading: false,
      theme: 'light',
      ai_tokens: 0,
      selectedAIModel: AIModel.GPT_4o,
      notification: {
        active: false,
        time: null,
      },
      userTime: new Date(),
      isAuthenticated: false,
      token: null,

      setUserTime: () => {
        setState({ userTime: new Date() });
        StorageService.setUserTime(new Date());
      },

      setUser: (userData: UserData | FormAnswers) => {
        const userWithDate: UserData = {
          ...userData,
          registrationDate: userData.registrationDate || new Date().toISOString(),
        };

        StorageService.setUser(userWithDate as FormAnswers);

        setState({
          userData: userWithDate,
          isAuthenticated: true,
          isLoading: false,
        });
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
        StorageService.setAiToken(get().ai_tokens - 1);
        setState((state) => ({ ai_tokens: state.ai_tokens - 1 }));
      },

      setAiTokens: (ai_tokens: number) => {
        setState({ ai_tokens });
        StorageService.setAiToken(ai_tokens);
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
        }
      },

      loadUser: () => {
        setState({ isLoading: true });
        try {
          const userData = StorageService.getUser();
          const token = StorageService.getItem('auth_token');
          const isAuthenticated = !!token;

          setState({
            userData: userData as UserData,
            token: token,
            isAuthenticated: isAuthenticated,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error loading user:', error);
          setState({
            userData: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      removeUser: () => {
        StorageService.removeUser();
        setState({
          userData: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      clearAll: () => {
        StorageService.removeUser();
        StorageService.removeItem('auth_token');
        setState({
          userData: null,
          token: null,
          isAuthenticated: false,
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
        setState({ token, isAuthenticated: !!token });
      },

      setAuthenticated: (isAuthenticated: boolean) => {
        setState({ isAuthenticated });
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
          const selectedAIModel = StorageService.getSelectedAIModel() || 'grok-4';
          const token = StorageService.getItem('auth_token');
          const isAuthenticated = !!token;

          return JSON.stringify({
            state: {
              userData: userData as UserData,
              isAuthenticated: isAuthenticated,
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
