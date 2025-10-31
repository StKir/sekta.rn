import React from 'react';

import { OnboardingData } from './types';
import { defaultOnboardingData } from './defaultData';

import Carousel, { CarouselProps } from '@/shared/ui/Carousel';

type OnboardingProps = Omit<CarouselProps, 'data'> & {
  data?: OnboardingData;
};

const Onboarding = ({ data = defaultOnboardingData, ...props }: OnboardingProps) => {
  return <Carousel data={data} enableSwipe={false} {...props} />;
};

export default Onboarding;
