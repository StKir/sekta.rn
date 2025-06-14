import { View, StyleSheet, Image } from 'react-native';
import React from 'react';

import { typography } from '@/theme/typography';
import { colors } from '@/theme/colors';
import { Button } from '@/shared/ui';
import { IMAGES } from '@/shared/constants/images';
import Text from '@/shared/components/Text/Text';

const HelloScreen = ({ onNext }: { onNext: () => unknown }) => {
  const handleStart = () => {
    onNext();
  };

  const handleLogin = () => {
    onNext();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image resizeMode='cover' source={IMAGES.welcomeBanner} style={styles.banner} />

        <Text style={styles.title} variant='h2'>
          Привет! 👋
        </Text>

        <Text style={styles.subtitle} variant={'button'}>
          Здесь ты можешь спокойно отслеживать своё настроение, мысли и самочувствие.
          {'\n'}
          {'\n'}
          Всё, что ты чувствуешь — важно.
        </Text>

        <Text style={styles.question} variant={'body1'}>
          Готов начать?
        </Text>

        <Button fullWidth title={'Начать'} onPress={handleStart} />
        <Button
          style={styles.link}
          textStyle={styles.linkText}
          title={'У меня уже есть аккаунт'}
          variant='text'
          onPress={handleLogin}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  banner: {
    width: '100%',
    height: 365,
    marginBottom: 32,
    borderRadius: 14,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,

    marginBottom: 16,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textPrimary,

    marginBottom: 32,
    lineHeight: 24,
  },
  question: {
    color: colors.textPrimary,
    marginBottom: 24,
    fontWeight: '600',
  },

  link: { textAlign: 'center', justifyContent: 'center' },
  linkText: {
    marginTop: 12,
    ...typography.body2,
    color: colors.primary,
    textAlign: 'center',
  },
});

export default HelloScreen;
