import { MMKV } from 'react-native-mmkv';

import { FormAnswers } from '../types/form.types';

const storage = new MMKV();

const STORAGE_KEYS = {
  USER: 'user',
  LENT: 'lent',
  THEME: 'theme',
};

export const StorageService = {
  setItem: (key: string, value: string) => storage.set(key, value),
  getItem: (key: string) => storage.getString(key) ?? null,
  removeItem: (key: string) => storage.delete(key),

  setUser: (userData: FormAnswers) => {
    try {
      storage.set(STORAGE_KEYS.USER, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  getTheme: () => {
    try {
      return storage.getString(STORAGE_KEYS.THEME) || 'light';
    } catch (error) {
      console.error('Error getting theme:', error);
      return null;
    }
  },

  setTheme: (theme: 'light' | 'dark') => {
    try {
      storage.set(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },

  getUser: () => {
    try {
      const userData = storage.getString(STORAGE_KEYS.USER);
      return userData ? (JSON.parse(userData) as FormAnswers) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  removeUser: () => {
    try {
      storage.delete(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  },

  hasUser: () => {
    try {
      return storage.contains(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error checking user data:', error);
      return false;
    }
  },
};
