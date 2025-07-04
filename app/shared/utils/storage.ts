import AsyncStorage from '@react-native-async-storage/async-storage';

import { RegisterFormData } from '@/pages/RegisterPage';

const STORAGE_KEYS = {
  USER: 'user',
};

export const StorageService = {
  setUser: async (userData: RegisterFormData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  getUser: async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? (JSON.parse(userData) as RegisterFormData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  removeUser: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  },

  hasUser: async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData !== null;
    } catch (error) {
      console.error('Error checking user data:', error);
      return false;
    }
  },
};
