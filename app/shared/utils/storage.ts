import { MMKV } from 'react-native-mmkv';

import { FormAnswers } from '../types/form.types';

const storage = new MMKV();

const STORAGE_KEYS = {
  USER: 'user',
  LENT: 'lent',
  THEME: 'theme',
  USER_TIME: 'user_time',
  NOTIFICATION: 'notification',
  AI_TOKEN: 'ai_token',
  LAST_LOGIN_DATE: 'last_login_date',
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

  setNotification: (notification: { active: boolean; time: Date | null }) => {
    try {
      // Преобразуем Date в строку перед сохранением
      const notificationToSave = {
        active: notification.active,
        time: notification.time ? notification.time.toISOString() : null,
      };
      storage.set(STORAGE_KEYS.NOTIFICATION, JSON.stringify(notificationToSave));
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  },

  getNotification: () => {
    try {
      if (!storage.getString(STORAGE_KEYS.NOTIFICATION)) {
        return null;
      }

      const savedNotification = JSON.parse(storage.getString(STORAGE_KEYS.NOTIFICATION) as string);

      // Преобразуем строку обратно в объект Date при получении
      return {
        active: savedNotification.active,
        time: savedNotification.time ? new Date(savedNotification.time) : null,
      };
    } catch (error) {
      console.error('Error getting notification:', error);
      return null;
    }
  },

  setUserTime: (time: Date) => {
    try {
      // Преобразуем Date в строку ISO перед сохранением
      storage.set(STORAGE_KEYS.USER_TIME, time.toISOString());
    } catch (error) {
      console.error('Error saving user time:', error);
    }
  },

  setAiToken: (ai_tokens: number) => {
    try {
      storage.set(STORAGE_KEYS.AI_TOKEN, ai_tokens.toString());
    } catch (error) {
      console.error('Error saving ai token:', error);
    }
  },

  getAiToken: () => {
    try {
      return Number(storage.getString(STORAGE_KEYS.AI_TOKEN)) || 0;
    } catch (error) {
      console.error('Error getting ai token:', error);
      return 0;
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
