import { SafeAreaView } from 'react-native-safe-area-context';
import CarouselLib, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { StyleSheet, Dimensions } from 'react-native';
import React, { useRef } from 'react';

import { OnboardingData } from './types';
import OnboardingSlide from './OnboardingSlide';

import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { IMAGES } from '@/shared/constants/images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const mockData: OnboardingData = {
  slides: [
    {
      id: '1',
      title: 'Создание записи',
      description:
        'Кнопка + в середние таб бара открывает список записей, выбери нужную и нажми на нее',
      image: IMAGES.onboarding1.uri,
    },
    {
      id: '1',
      title: 'Получайте токены за вход в приложение',
      description:
        'Если вы часто пользуетесь приложением, то получаете токены, которые можно использовать для получения функционала искусственного интеллекта.',
    },
    {
      id: '3',
      title: 'Искусственный интеллект для анализа',
      description:
        'Современный искусственный интеллект глубоко анализирует ваши записи, чтобы давать максимально точные и полезные рекомендации.',
      image: IMAGES.onboarding2.uri,
    },
    {
      id: '343',
      title: 'Чем чаще вы пользуетесь приложением, тем точнее будет анализ',
      description:
        'Старайтесь делать записи каждый день, чтобы получать максимально точные рекомендации.',
    },
    {
      id: '4',
      title: 'Начнем!',
      description: 'Все готово для старта вашего путешествия к лучшей версии себя!',
    },
  ],
};

type OnboardingProps = {
  onComplete: () => void;
};

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const carouselRef = useRef<ICarouselInstance>(null);

  const nextStep = () => {
    carouselRef.current?.next();
  };

  const prevStep = () => {
    carouselRef.current?.prev();
  };

  const renderItem = ({ item, index }: { item: OnboardingData['slides'][0]; index: number }) => {
    const isLastSlide = index === mockData.slides.length - 1;

    const handleNext = () => {
      if (isLastSlide) {
        onComplete();
      } else {
        nextStep();
      }
    };

    return (
      <OnboardingSlide
        isLastSlide={isLastSlide}
        slide={item}
        onNext={handleNext}
        onPrev={index > 0 ? prevStep : undefined}
      />
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <CarouselLib
        data={mockData.slides}
        enabled={false}
        height={Dimensions.get('screen').height}
        loop={false}
        mode='parallax'
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 0.5,
          parallaxAdjacentItemScale: 0.6,
        }}
        ref={carouselRef}
        renderItem={renderItem}
        width={SCREEN_WIDTH}
      />
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
  });

export default Onboarding;
