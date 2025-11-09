import { Alert } from 'react-native';
import { useEffect } from 'react';

import { StorageService } from '@/shared/utils/storage';
import { useUserStore } from '@/entities/user';

export const useDailyFirstLogin = () => {
  const { plusAiToken } = useUserStore();

  useEffect(() => {
    const checkFirstLoginOfDay = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const todayString = today.toISOString();
      const yesterdayString = yesterday.toISOString();
      const lastLoginString = StorageService.getItem('last_login_date');

      if (lastLoginString === yesterdayString) {
        StorageService.setItem('last_login_date', todayString);
        Alert.alert('Вы получили 1 токен', 'Спасибо что пользуешься мной');
        plusAiToken();
      } else if (!lastLoginString || lastLoginString !== todayString) {
        StorageService.setItem('last_login_date', todayString);
      }
    };

    checkFirstLoginOfDay();
  }, [plusAiToken]);
};
