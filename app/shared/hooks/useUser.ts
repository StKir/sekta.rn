import { Alert } from 'react-native';
import { useCallback } from 'react';

import { subscriptionApi } from '../api/subscriptionApi';

import { calculateAge } from '@/shared/utils/dateUtils';
import { UseUserReturn } from '@/shared/types/user.types';
import { useUserStore } from '@/entities/user';

export const useUser = (): UseUserReturn => {
  const {
    userData,
    isLoading,
    setAiTokens,
    isAuthenticated,
    setUser,
    updateUser,
    loadUser,
    removeUser,
  } = useUserStore();

  const checkSubscription = useCallback(async () => {
    try {
      const response = await subscriptionApi.checkAccess();
      if (response.hasAccess) {
        await subscriptionApi.getCurrentUser().then((res) => {
          setUser(res.user);
          if (res.user.tariff_info?.trialCount || res.user.tariff_info.trialCount === 0) {
            setAiTokens(res.user.tariff_info.trialCount);
          }
        });
        return true;
      } else {
        console.log(response);

        Alert.alert(response.reason || 'У вас закончились токены(');
        return false;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [setUser]);

  return {
    userData,
    isLoading,
    isAuthenticated,
    setUser,
    theme: userData?.theme || 'light',
    updateUser,
    loadUser,
    removeUser,
    checkSubscription,
    // Дополнительные вычисляемые свойства
    isLoggedIn: isAuthenticated && !!userData,
    userName: userData?.name || 'Пользователь',
    userBirthDate: userData?.birthDate || null,
    notification: userData?.notification || { active: false, time: null },
    userAge: userData?.birthDate ? calculateAge(userData.birthDate) : null,
    userGender: userData?.gender || null,
    registrationDate: userData?.registrationDate || null,
    profilePhoto: userData?.profile_photo || null,
    avatar: userData?.avatar || null,
  };
};
