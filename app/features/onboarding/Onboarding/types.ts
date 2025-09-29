export type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  image?: string;
};

export type OnboardingData = {
  slides: OnboardingSlide[];
};
