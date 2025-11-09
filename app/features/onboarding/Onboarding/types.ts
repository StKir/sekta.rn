export type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  image?: string;
  smile?: string;
};

export type OnboardingData = {
  slides: OnboardingSlide[];
};
