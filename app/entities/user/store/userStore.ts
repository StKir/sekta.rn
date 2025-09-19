import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

import { StorageService } from '@/shared/utils/storage';
import { UserData } from '@/shared/types/user.types';
import { FormAnswers } from '@/shared/types/form.types';

interface UserState {
  userData: UserData | null;
  isLoading: boolean;
  ai_tokens: number;
  notification: {
    active: boolean;
    time: Date | null;
  };
  theme: 'light' | 'dark';
  userTime: Date;
  isAuthenticated: boolean;
}

interface UserActions {
  setUser: (userData: UserData | FormAnswers) => void;
  updateUser: (userData: Partial<UserData>) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setNotification: (notification: { active: boolean; time: Date | null }) => void;
  loadUser: () => void;
  removeUser: () => void;
  clearAll: () => void;
  plusAiToken: () => void;
  minusAiToken: () => void;
  setAiTokens: (ai_tokens: number) => void;
  setUserTime: () => void;
  getNotification: () => { active: boolean; time: Date | null };
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  persist(
    (setState, get) => ({
      userData: null,
      isLoading: false,
      theme: 'light',
      ai_tokens: 0,
      notification: {
        active: false,
        time: null,
      },
      userTime: new Date(),
      isAuthenticated: false,

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
      },

      minusAiToken: () => {
        StorageService.setAiToken(get().ai_tokens - 1);
        setState((state) => ({ ai_tokens: state.ai_tokens - 1 }));
      },

      setAiTokens: (ai_tokens: number) => {
        setState({ ai_tokens });
        StorageService.setAiToken(ai_tokens);
      },

      setNotification: (notification: { active: boolean; time: Date | null }) => {
        setState({ notification });
        StorageService.setNotification(notification);
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
          setState({
            userData: userData as UserData,
            isAuthenticated: !!userData,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error loading user:', error);
          setState({
            userData: null,
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
        setState({
          userData: null,
          isAuthenticated: false,
          isLoading: false,
        });
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
          return JSON.stringify({
            state: {
              userData: userData as UserData,
              isAuthenticated: !!userData,
              isLoading: false,
              theme: theme as 'light' | 'dark',
              ai_tokens: ai_tokens,
              notification: notification,
            },
          });
        },
        setItem: (name, value) => {
          const parsed = JSON.parse(value);
          if (parsed.state?.userData) {
            StorageService.setUser(parsed.state.userData as FormAnswers);
          }
        },
        removeItem: () => {
          StorageService.removeUser();
        },
      })),
    }
  )
);
