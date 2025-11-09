import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import Text from '@/shared/ui/Text/Text';
import Input from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui';
import { typography } from '@/shared/theme/typography';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';
import { authApi } from '@/shared/api/authApi';
import { apiClient } from '@/shared/api/apiClient';
import { RootStackParamList } from '@/navigation/types';
import { useUserStore } from '@/entities/user/store/userStore';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<NavigationProp>();
  const { setUser, setToken, setAuthenticated, userData } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Ошибка', 'Заполните email и пароль');
      return;
    }

    try {
      setIsLoading(true);

      const getGender = (): 'male' | 'female' | 'other' | undefined => {
        if (!userData?.gender) {
          return undefined;
        }
        if (typeof userData.gender === 'string') {
          if (
            userData.gender === 'male' ||
            userData.gender === 'female' ||
            userData.gender === 'other'
          ) {
            return userData.gender;
          }
        }
        return undefined;
      };

      const registerData = {
        email: formData.email,
        password: formData.password,
        ...(userData?.name && { name: userData.name }),
        ...(userData?.birthDate && { birthDate: userData.birthDate }),
        ...(getGender() && { gender: getGender() }),
      };

      const response = await authApi.register(registerData);

      if (response.token) {
        setToken(response.token);
        apiClient.setToken(response.token);
      }

      if (response.user) {
        setUser({
          email: response.user.email,
          name: response.user.name || userData?.name,
          birthDate: response.user.birthDate || userData?.birthDate,
          gender: response.user.gender || userData?.gender,
          registrationDate: response.user.registrationDate || new Date().toISOString(),
          tariff_info: response.user.tariff_info,
        });
        setAuthenticated(true);
        navigation.navigate('TabNavigator');
      }
    } catch (error) {
      Alert.alert('Ошибка', error instanceof Error ? error.message : 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title} variant='h2'>
            Вход
          </Text>
          <Text style={styles.subtitle} variant='body1'>
            Войдите в свой аккаунт
          </Text>

          <View style={styles.form}>
            <Input
              autoCapitalize='none'
              keyboardType='email-address'
              label='Email'
              placeholder='example@email.com'
              value={formData.email}
              onChangeText={(value) => setFormData((prev) => ({ ...prev, email: value }))}
            />

            <Input
              secureTextEntry
              label='Пароль'
              placeholder='Минимум 6 символов'
              value={formData.password}
              onChangeText={(value) => setFormData((prev) => ({ ...prev, password: value }))}
            />

            <Button fullWidth loading={isLoading} title='Войти' onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: SPACING.LARGE,
      paddingHorizontal: SPACING.LARGE,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      ...typography.h1,
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.SMALL,
    },
    subtitle: {
      ...typography.body1,
      color: colors.TEXT_SECONDARY,
      marginBottom: SPACING.LARGE * 2,
    },
    form: {
      gap: SPACING.MEDIUM,
    },
  });

export default LoginScreen;
