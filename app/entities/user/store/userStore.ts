import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

import { StorageService } from '@/shared/utils/storage';
import { UserData } from '@/shared/types/user.types';
import { FormAnswers } from '@/shared/types/form.types';

interface UserState {
  userData: UserData | null;
  isLoading: boolean;
  notification: {
    active: boolean;
    time: Date | null;
  };
  theme: 'light' | 'dark';
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
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  persist(
    (setState, get) => ({
      userData: null,
      isLoading: false,
      theme: 'light',
      notification: {
        active: false,
        time: null,
      },
      isAuthenticated: false,

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

      setTheme: (theme: 'light' | 'dark') => {
        setState({ theme });
        StorageService.setTheme(theme);
      },

      setNotification: (notification: { active: boolean; time: Date | null }) => {
        setState({ notification });
      },

      updateUser: (updatedData: Partial<UserData>) => {
        const currentUser = get().userData;
        if (currentUser) {
          const updatedUser: UserData = { ...currentUser, ...updatedData };

          // Сохраняем в StorageService для совместимости
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
          return JSON.stringify({
            state: {
              userData: userData as UserData,
              isAuthenticated: !!userData,
              isLoading: false,
              theme: theme as 'light' | 'dark',
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
