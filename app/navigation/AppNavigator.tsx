import { View, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import PaywallPage from '@/pages/PaywallPage';
import OnboardingPage from '@/pages/OnboardingPage';
import NotePage from '@/pages/NotePage';
import NewRegisterPage from '@/pages/NewRegisterPage';
import MomentPage from '@/pages/MomentPage';
import CheckInPage from '@/pages/CheckInPage';
import AiQuestionPage from '@/pages/AiQuestionPage';
import AiPlayListPage from '@/pages/AiPlayListPage';
import AiPlans from '@/pages/AiPlans';
import AIResultPage from '@/pages/AIResultPage';
import AIResultCheckPage from '@/pages/AIResultCheckPage';

import { RootStackParamList } from './types';
import TabNavigator from './TabNavigator';

import BottomSheet from '@/shared/ui/BottomSheet/BottomSheet';
import { useTheme } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { authApi } from '@/shared/api/authApi';
import { apiClient } from '@/shared/api/apiClient';
import LoginScreen from '@/features/auth/LoginScreen/LoginScreen';
import { useUserStore } from '@/entities/user/store/userStore';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { colors } = useTheme();
  const { isLoading, loadUser, setUser, userName } = useUser();
  const { setToken, setAuthenticated } = useUserStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const token = apiClient.getToken();

        if (token) {
          setToken(token);
          setAuthenticated(true);

          try {
            const me = await authApi.getUserMe();

            if (me.user) {
              setUser({
                email: me.user.email,
                name: me.user.name,
                birthDate: me.user.birthDate,
                gender: me.user.gender,
                registrationDate: me.user.registrationDate || new Date().toISOString(),
                tariff_info: me.user.tariff_info,
              });
            }
          } catch {
            // Если токен невалидный, просто очищаем его, но не блокируем доступ к приложению
            apiClient.clearToken();
            setToken(null);
            setAuthenticated(false);
          }
        } else {
          setToken(null);
          setAuthenticated(false);
        }
      } catch {
        // Игнорируем ошибки при загрузке токена
        setToken(null);
        setAuthenticated(false);
      }
    };
    hydrateUser();
  }, [setUser, setToken, setAuthenticated]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.BACKGROUND_PRIMARY }]}>
        <ActivityIndicator color={colors.PRIMARY} size='large' />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={userName ? 'TabNavigator' : 'Register'}
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      >
        <Stack.Screen component={NewRegisterPage} name='Register' />
        <Stack.Screen component={LoginScreen} name='LoginScreen' />
        <Stack.Screen component={TabNavigator} name='TabNavigator' />
        <Stack.Screen component={CheckInPage} name='CheckInPage' />
        <Stack.Screen component={AiPlayListPage} name='AiPlayListPage' />
        <Stack.Screen component={AiQuestionPage} name='AiQuestionPage' />

        <Stack.Screen component={AiPlans} name='AiPlans' />
        <Stack.Screen component={MomentPage} name='MomentPage' />
        <Stack.Screen component={NotePage} name='NotePage' />
        <Stack.Screen component={AIResultPage} name='AIResultPage' />
        <Stack.Screen component={AIResultCheckPage} name='AIResultCheckPage' />
        <Stack.Screen component={OnboardingPage} name='OnboardingPage' />
        <Stack.Screen component={PaywallPage} name='PaywallPage' />
      </Stack.Navigator>
      <BottomSheet />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
