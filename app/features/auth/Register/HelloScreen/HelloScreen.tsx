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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image resizeMode='cover' source={IMAGES.welcomeBanner} style={styles.banner} />

          <View style={styles.titleContainer}>
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

          <Text style={styles.subtitle} variant={'button'}>
            Чем честнее и регулярнее ты делишься тем, что с тобой происходит, тем точнее Sekta
            помогает увидеть картину и подсказать следующий шаг.
          </Text>

          <Text style={styles.question} variant={'body1'}>
            Готов начать?{'\n'}
          </Text>
        </View>
        <View>
          <Button fullWidth title={'Начать'} onPress={handleStart} />
        </View>
        <View style={styles.bottomSpacer} />
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
    banner: {
      width: '100%',
      height: 400,
      marginBottom: 32,
      borderRadius: 14,
    },
    titleContainer: {
      marginBottom: 16,
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
    bottomSpacer: {
      height: 60,
    },
  });

export default HelloScreen;
