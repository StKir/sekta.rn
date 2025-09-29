import { Alert } from 'react-native';
import { useEffect } from 'react';

import { StorageService } from '@/shared/utils/storage';
import { useUserStore } from '@/entities/user';

export const useDailyFirstLogin = () => {
  const { plusAiToken } = useUserStore();

  useEffect(() => {
    const checkFirstLoginOfDay = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

      const lastLoginString = StorageService.getItem('last_login_date');

      if (!lastLoginString || lastLoginString !== today) {
        StorageService.setItem('last_login_date', today);

        if (lastLoginString) {
          Alert.alert('Вы получили 1 токен', 'Спасибо что пользуешься мной');
        }

        plusAiToken();
      }
    };

    checkFirstLoginOfDay();
  }, [plusAiToken]);
};
