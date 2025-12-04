import { Alert, Linking } from 'react-native';
import { useState, useCallback } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { subscriptionApi, RegisterRequest, LoginRequest } from '@/shared/api/subscriptionApi';
import { RootStackParamList } from '@/navigation/types';
import { useUserStore } from '@/entities/user';

interface UseSubscriptionReturn {
  isLoading: boolean;
  register: (data: RegisterRequest) => Promise<boolean>;
  login: (data: LoginRequest) => Promise<boolean>;
  checkAccess: () => Promise<boolean>;
  activateSubscription: (duration: string, paymentId?: string) => Promise<boolean>;
  checkSubscription: () => Promise<boolean | null>;
}
type NavigationProp = StackNavigationProp<RootStackParamList>;

export const useSubscription = (): UseSubscriptionReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setAiTokens, ai_tokens, minusAiToken, tariffInfo } = useUserStore();
  const navigation = useNavigation<NavigationProp>();

  const register = useCallback(
    async (data: RegisterRequest): Promise<boolean> => {
      try {
        setIsLoading(true);
        const response = await subscriptionApi.register(data);

        if (response.user) {
          setUser(response.user);
        } else {
          const userData = await subscriptionApi.getCurrentUser();
          setUser(userData.user);
        }

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

  const activateSubscription = useCallback(async (duration: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const a = await subscriptionApi.activateSubscription({ duration });
      Linking.openURL(a.paymentUrl);
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
  }, []);

  const checkSubscription = useCallback(async () => {
    if (ai_tokens && !tariffInfo) {
      minusAiToken();
      return true;
    }
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
        navigation.navigate('PaywallPage', {
          onSuccess: () => {},
        });

        return false;
      }
    } catch (error) {
      Alert.alert('Ошибка', error instanceof Error ? error.message : 'Неизвестная ошибка');
      return null;
    }
  }, [ai_tokens, minusAiToken, navigation, setAiTokens, setUser]);

  return {
    isLoading,
    register,
    login,
    checkAccess,
    activateSubscription,
    checkSubscription,
  };
};
