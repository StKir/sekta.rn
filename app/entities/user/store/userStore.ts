import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

import { StorageService } from '@/shared/utils/storage';
import { UserData } from '@/shared/types/user.types';
import { FormAnswers } from '@/shared/types/form.types';

interface UserState {
  userData: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface UserActions {
  setUser: (userData: UserData | FormAnswers) => void;
  updateUser: (userData: Partial<UserData>) => void;
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
      isAuthenticated: false,

      setUser: (userData: UserData | FormAnswers) => {
        // Добавляем дату регистрации если её нет
        const userWithDate: UserData = {
          ...userData,
          registrationDate: userData.registrationDate || new Date().toISOString(),
        };

        // Сохраняем в StorageService для совместимости
        StorageService.setUser(userWithDate as FormAnswers);

        setState({
          userData: userWithDate,
          isAuthenticated: true,
          isLoading: false,
        });
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
          return JSON.stringify({
            state: {
              userData: userData as UserData,
              isAuthenticated: !!userData,
              isLoading: false,
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
