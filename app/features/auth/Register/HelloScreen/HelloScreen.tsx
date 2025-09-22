import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Image, View, ScrollView } from 'react-native';
import React from 'react';

import Text from '@/shared/ui/Text/Text';
import { Button } from '@/shared/ui';
import { typography } from '@/shared/theme/typography';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { IMAGES } from '@/shared/constants/images';
import { SPACING } from '@/shared/constants';

const HelloScreen = ({ onNext }: { onNext: () => unknown }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const handleStart = () => {
    onNext();
  };

  // const handleLogin = () => {
  //   onNext();
  // };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image resizeMode='cover' source={IMAGES.welcomeBanner} style={styles.banner} />

          <View style={{ marginBottom: 16 }}>
            <Text style={styles.title} variant='h2'>
              Привет! 👋
            </Text>
            <Text variant='h3'>Я Кирилл, создатель этого приложения.</Text>
          </View>

          <Text style={styles.question} variant={'body1'}>
            Главная проблема
          </Text>
          <Text style={styles.subtitle} variant={'button'}>
            Бывало, живешь будто на автопилоте: неделя пролетает, а вспомнить ничего не можешь. От
            чего устал? Что порадовало? Почему сегодня грустно, а вчера было светло на душе? В
            голове — каша из эмоций, а понять себя все сложнее.
          </Text>
          <Text style={styles.question} variant={'body1'}>
            Что помогает?
          </Text>

          <Text style={styles.subtitle} variant={'button'}>
            Поэтому я создал пространство, где можно не просто вести diary, а получать реальные
            инсайты о себе. Просто добавляй мысли, эмоции и моменты дня — а наш ИИ сделает выводы и
            даст ценные советы.
          </Text>
          <Text style={styles.question} variant={'body1'}>
            Готов начать?
          </Text>

          <Text style={styles.subtitle} variant={'button'}>
            &quot;Секта&quot; — это ритуал заботы о себе. Всего несколько минут в день, чтобы лучше
            понимать себя с помощью искусственного интеллекта, который видит закономерности в твоих
            записях. Здесь нет сложного. Просто ты и твои мысли.
          </Text>
        </View>
        <View>
          <Button fullWidth title={'Начать'} onPress={handleStart} />
          {/* <Button
          style={styles.link}
          textStyle={styles.linkText}
          title={'У меня уже есть аккаунт'}
          variant='text'
          onPress={handleLogin}
        /> */}
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
  });

export default HelloScreen;
