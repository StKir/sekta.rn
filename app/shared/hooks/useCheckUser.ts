import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { userApi } from '../api';

import { useUserStore } from '@/entities/user';

const useCheckUser = () => {
  const { updateUser, setTariffInfo } = useUserStore();

  const updateUserInfo = useCallback(async () => {
    const { user } = await userApi.getMe();

    if (user) {
      updateUser({
        name: user.name,
        email: user.email,
      });

      if (user.tariff_info) {
        setTariffInfo(user.tariff_info);
      }
    }
  }, [setTariffInfo, updateUser]);

  useFocusEffect(
    useCallback(() => {
      updateUserInfo();
    }, [updateUserInfo])
  );
};

export default useCheckUser;
