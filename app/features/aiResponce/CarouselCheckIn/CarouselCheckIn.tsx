import React from 'react';

import Carousel from '@/shared/ui/Carousel';
import { OnboardingData } from '@/features/onboarding/Onboarding/types';

type CarouselCheckInProps = {
  data: OnboardingData;
  onComplete: () => void;
};

const CarouselCheckIn = ({ data, onComplete }: CarouselCheckInProps) => {
  return (
    <Carousel
      enableSwipe
      data={data}
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
