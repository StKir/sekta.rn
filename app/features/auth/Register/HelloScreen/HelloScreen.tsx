import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Image, View, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';

import Text from '@/shared/ui/Text/Text';
import Input from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui';
import { typography } from '@/shared/theme/typography';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useSubscription } from '@/shared/hooks/useSubscription';
import { IMAGES } from '@/shared/constants/images';
import { SPACING } from '@/shared/constants';

const HelloScreen = ({ onNext }: { onNext: () => unknown }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { login, isLoading } = useSubscription();

  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleStart = () => {
    onNext();
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    const success = await login(loginData);
    if (success) {
      onNext();
    }
  };

  const handleLoginPress = () => {
    setShowLogin(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image resizeMode='cover' source={IMAGES.welcomeBanner} style={styles.banner} />

          <View style={{ marginBottom: 16 }}>
            <Text style={styles.title} variant='h2'>
              Привет! 👋
            </Text>
            <Text variant='h3'>Добро пожаловать в Sekta!</Text>
          </View>

          <Text variant='h3'></Text>

          <Text style={styles.subtitle} variant={'button'}>
            &quot;Sekta&quot; - это ритуал заботы о себе. Веди свой дневник, рефлексируй, храни
            моменты, тут есть все что тебе нужно + новые возможности от ИИ. Просто добавляй мысли,
            эмоции и моменты дня — а наш ИИ сделает выводы и даст ценные советы.
          </Text>
          <Text style={styles.question} variant={'body1'}>
            Готов начать?{'\n'}
          </Text>
        </View>
        <View>
          {!showLogin ? (
            <>
              <Button fullWidth title={'Начать'} onPress={handleStart} />
              <Button
                style={styles.link}
                textStyle={styles.linkText}
                title={'У меня уже есть аккаунт'}
                variant='text'
                onPress={handleLoginPress}
              />
            </>
          ) : (
            <View style={styles.loginContainer}>
              <Text style={styles.loginTitle}>Вход в аккаунт</Text>
              <Input
                autoCapitalize='none'
                keyboardType='email-address'
                label='Email'
                placeholder='example@email.com'
                value={loginData.email}
                onChangeText={(value) => setLoginData((prev) => ({ ...prev, email: value }))}
              />
              <Input
                secureTextEntry
                label='Пароль'
                placeholder='Введите пароль'
                value={loginData.password}
                onChangeText={(value) => setLoginData((prev) => ({ ...prev, password: value }))}
              />
              <Button fullWidth loading={isLoading} title={'Войти'} onPress={handleLogin} />
              <Button
                style={styles.link}
                textStyle={styles.linkText}
                title={'Назад'}
                variant='text'
                onPress={() => setShowLogin(false)}
              />
            </View>
          )}
        </View>
        <View style={{ height: 60 }} />
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
    },
    content: {
      marginBottom: 20,
    },
    banner: {
      width: '100%',
      height: 400,
      marginBottom: 32,
      borderRadius: 14,
    },
    title: {
      ...typography.h1,
      color: colors.TEXT_PRIMARY,
    },
    subtitle: {
      ...typography.body1,
      color: colors.TEXT_PRIMARY,

      marginBottom: 32,
      lineHeight: 24,
    },
    question: {
      color: colors.TEXT_PRIMARY,

      fontWeight: '600',
    },

    link: { textAlign: 'center', justifyContent: 'center' },
    linkText: {
      marginTop: 12,
      ...typography.body2,
      color: colors.PRIMARY,
      textAlign: 'center',
    },
    loginContainer: {
      gap: 16,
    },
    loginTitle: {
      ...typography.h3,
      color: colors.TEXT_PRIMARY,
      textAlign: 'center',
      marginBottom: 8,
    },
  });

export default HelloScreen;
