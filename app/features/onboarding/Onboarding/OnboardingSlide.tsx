/* eslint-disable react-native/no-unused-styles */
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import React from 'react';

import { OnboardingSlide as OnboardingSlideType } from './types';

import Text from '@/shared/ui/Text';
import { Button } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type OnboardingSlideProps = {
  slide: OnboardingSlideType;
  onNext: () => void;
  onPrev?: () => void;
  isLastSlide?: boolean;
};

const OnboardingSlide = ({ slide, onNext, onPrev, isLastSlide }: OnboardingSlideProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {slide.image && (
        <Image resizeMode='center' source={{ uri: slide.image }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.title} variant='h1'>
          {slide.title}
        </Text>
        <Text style={styles.description} variant='body1'>
          {slide.description}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        {onPrev && <Button title='Назад' variant='primary-light' onPress={onPrev} />}

        <Button title={isLastSlide ? 'Завершить' : 'Далее'} onPress={onNext} />
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: SCREEN_WIDTH,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 80,
    },
    image: {
      width: '100%',
      height: '100%',
      maxWidth: '90%',
      maxHeight: 300,
      justifyContent: 'center',
      alignItems: 'center',
      resizeMode: 'cover',
    },
    content: {
      padding: 20,
    },
    title: {
      marginBottom: 16,
      textAlign: 'center',
    },
    description: {
      textAlign: 'center',
    },
    buttonsContainer: {
      position: 'absolute',
      bottom: 60,
      width: '100%',

      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
      paddingBottom: 40,
    },
    buttonText: {
      color: colors.PRIMARY,
    },
  });

export default OnboardingSlide;
