/* eslint-disable react-native/no-unused-styles */
import { View, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import React from 'react';

import Text from '@/shared/ui/Text';
import { Button } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { OnboardingSlide as OnboardingSlideType } from '@/features/onboarding/Onboarding/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ScrollableSlideProps = {
  slide: OnboardingSlideType;
  onNext: () => void;
  onPrev?: () => void;
  isLastSlide?: boolean;
};

const ScrollableSlide = ({ slide, onNext, onPrev, isLastSlide }: ScrollableSlideProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        directionalLockEnabled={true} // Блокирует диагональный скролл
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {slide?.smile ? (
            <Text style={styles.smile} variant='h1'>
              {slide.smile}
            </Text>
          ) : null}
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
        </View>
      </ScrollView>
      <View style={styles.buttonsContainer}>
        {onPrev && <Button title='Назад' variant='primary-light' onPress={onPrev} />}

        <Button title={isLastSlide ? 'Завершить' : 'Далее'} onPress={onNext} />
      </View>
    </>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: SCREEN_WIDTH,
    },
    gestureRoot: {
      flex: 1,
    },
    scrollContainer: {
      paddingBottom: 120, // Дополнительный отступ для кнопок
      paddingTop: 20,
      backgroundColor: 'none',
    },
    image: {
      width: '100%',
      height: 300,
      maxWidth: '90%',
      justifyContent: 'center',
      alignItems: 'center',
      resizeMode: 'cover',
      marginBottom: 20,
    },
    content: {
      padding: 20,
      width: '100%',
    },
    smile: {
      fontSize: 160,
      lineHeight: 200,
      textAlign: 'center',
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
      bottom: 70,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
      textAlign: 'center',
      elevation: 5,
    },
    buttonText: {
      color: colors.PRIMARY,
    },
  });

export default ScrollableSlide;
