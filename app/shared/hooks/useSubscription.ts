import { Alert } from 'react-native';
import { useState, useCallback } from 'react';

import { subscriptionApi, RegisterRequest, LoginRequest } from '@/shared/api/subscriptionApi';
import { useUserStore } from '@/entities/user';

interface UseSubscriptionReturn {
  isLoading: boolean;
  register: (data: RegisterRequest) => Promise<boolean>;
  login: (data: LoginRequest) => Promise<boolean>;
  checkAccess: () => Promise<boolean>;
  activateSubscription: (
    duration: '1month' | '3months' | '1year',
    paymentId?: string
  ) => Promise<boolean>;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserStore();

  const register = useCallback(
    async (data: RegisterRequest): Promise<boolean> => {
      try {
        setIsLoading(true);
        const response = await subscriptionApi.register(data);

        // Получаем данные пользователя после регистрации
        if (response.user) {
          setUser(response.user);
        } else {
          // Если user не вернулся в ответе, получаем его отдельно
          const userData = await subscriptionApi.getCurrentUser();
          setUser(userData.user);
        }

        // Убираем Alert, чтобы не блокировать UI
        return true;
      } catch (error) {
        Alert.alert(
          'Ошибка регистрации',
          error instanceof Error ? error.message : 'Неизвестная ошибка'
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser]
  );

  const login = useCallback(
    async (data: LoginRequest): Promise<boolean> => {
      try {
        setIsLoading(true);
        await subscriptionApi.login(data);

        // Получаем данные пользователя после входа
        const userData = await subscriptionApi.getCurrentUser();
        setUser(userData.user);

        // Убираем Alert, чтобы не блокировать UI
        return true;
      } catch (error) {
        Alert.alert('Ошибка входа', error instanceof Error ? error.message : 'Неизвестная ошибка');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser]
  );

  const checkAccess = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await subscriptionApi.checkAccess();
      return result.hasAccess;
    } catch (error) {
      Alert.alert(
        'Ошибка проверки доступа',
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const activateSubscription = useCallback(
    async (duration: '1month' | '3months' | '1year', paymentId?: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        await subscriptionApi.activateSubscription({ duration, paymentId });
        Alert.alert('Успешно!', 'Подписка активирована');
        return true;
      } catch (error) {
        Alert.alert(
          'Ошибка активации',
          error instanceof Error ? error.message : 'Неизвестная ошибка'
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    register,
    login,
    checkAccess,
    activateSubscription,
  };
};
