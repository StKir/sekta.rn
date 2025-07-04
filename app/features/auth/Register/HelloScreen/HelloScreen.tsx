import { StyleSheet, Image, Dimensions, View } from 'react-native';
import React from 'react';

import Text from '@/shared/ui/Text/Text';
import { Button } from '@/shared/ui';
import { typography } from '@/shared/theme/typography';
import { useTheme } from '@/shared/theme';
import { IMAGES } from '@/shared/constants/images';

const HelloScreen = ({ onNext }: { onNext: () => unknown }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
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
      </View>
      <View>
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      height: Dimensions.get('screen').height - 100,

      justifyContent: 'space-between',
    },
    content: {},
    banner: {
      width: '100%',
      height: 350,
      marginBottom: 32,
      borderRadius: 14,
    },
    title: {
      ...typography.h1,
      color: colors.TEXT_PRIMARY,

      marginBottom: 16,
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
  });

export default HelloScreen;
