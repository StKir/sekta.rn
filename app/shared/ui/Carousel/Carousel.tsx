import { SafeAreaView } from 'react-native-safe-area-context';
import CarouselLib, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { StyleSheet, Dimensions, ViewStyle } from 'react-native';
import React, { useRef, ReactElement } from 'react';

import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { OnboardingData, OnboardingSlide as SlideType } from '@/features/onboarding/Onboarding/types';
import OnboardingSlide from '@/features/onboarding/Onboarding/OnboardingSlide';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type CarouselProps = {
  onComplete: () => void;
  data: OnboardingData;
  containerStyle?: ViewStyle;
  enableSwipe?: boolean;
  loop?: boolean;
  carouselMode?: any; // 'parallax' | 'horizontal-stack' | 'vertical-stack'
  parallaxConfig?: {
    scrollingScale?: number;
    scrollingOffset?: number;
    adjacentItemScale?: number;
  };
  customRenderItem?: (props: {
    item: SlideType;
    index: number;
    isLastSlide: boolean;
    onNext: () => void;
    onPrev?: () => void;
  }) => React.ReactNode;
};

const Carousel = ({
  onComplete,
  data,
  containerStyle,
  enableSwipe = false,
  loop = false,
  carouselMode = 'parallax',
  parallaxConfig = {
    scrollingScale: 1,
    scrollingOffset: 0.5,
    adjacentItemScale: 0.6,
  },
  customRenderItem,
}: CarouselProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const carouselRef = useRef<ICarouselInstance>(null);

  const nextStep = () => {
    carouselRef.current?.next();
  };

  const prevStep = () => {
    carouselRef.current?.prev();
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: SlideType;
    index: number;
  }): ReactElement => {
    const isLastSlide = index === data.slides.length - 1;

    const handleNext = () => {
      if (isLastSlide) {
        onComplete();
      } else {
        nextStep();
      }
    };

    if (customRenderItem) {
      return customRenderItem({
        item,
        index,
        isLastSlide,
        onNext: handleNext,
        onPrev: index > 0 ? prevStep : undefined,
      }) as ReactElement;
    }

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
    <SafeAreaView edges={['top', 'bottom']} style={[styles.container, containerStyle]}>
      <CarouselLib
        data={data.slides}
        enabled={enableSwipe}
        height={Dimensions.get('screen').height}
        loop={loop}
        mode={carouselMode}
        modeConfig={
          carouselMode === 'parallax'
            ? {
                parallaxScrollingScale: parallaxConfig.scrollingScale,
                parallaxScrollingOffset: parallaxConfig.scrollingOffset,
                parallaxAdjacentItemScale: parallaxConfig.adjacentItemScale,
              }
            : undefined
        }
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

export default Carousel;
