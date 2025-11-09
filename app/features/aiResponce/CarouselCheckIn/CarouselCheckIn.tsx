import React from 'react';

import ScrollableSlide from './ScrollableSlide';

import Carousel from '@/shared/ui/Carousel';
import { OnboardingData } from '@/features/onboarding/Onboarding/types';

type CarouselCheckInProps = {
  data: OnboardingData;
  onComplete: () => void;
};

const CarouselCheckIn = ({ data, onComplete }: CarouselCheckInProps) => {
  // Кастомный рендер для слайда с возможностью скролла
  const renderScrollableSlide = ({
    item,
    index: _index, // Переименовываем в _index, чтобы соответствовать правилу unused args
    isLastSlide,
    onNext,
    onPrev,
  }: {
    item: OnboardingData['slides'][0];
    index: number;
    isLastSlide: boolean;
    onNext: () => void;
    onPrev?: () => void;
  }) => {
    // _index не используется в реализации
    return (
      <ScrollableSlide isLastSlide={isLastSlide} slide={item} onNext={onNext} onPrev={onPrev} />
    );
  };

  return (
    <Carousel
      customRenderItem={renderScrollableSlide}
      data={data}
      enableSwipe={false} // Отключаем свайп для карусели, чтобы избежать конфликта с вертикальным скроллом
      parallaxConfig={{
        scrollingScale: 1,
        scrollingOffset: 100,
        adjacentItemScale: 0.6,
      }}
      onComplete={onComplete}
    />
  );
};

export default CarouselCheckIn;
