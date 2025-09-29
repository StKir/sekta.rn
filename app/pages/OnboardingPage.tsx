import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '@/navigation/types';
import Onboarding from '@/features/onboarding/Onboarding/Onboarding';

const OnboardingPage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleComplete = () => {
    navigation.navigate('TabNavigator');
  };

  return <Onboarding onComplete={handleComplete} />;
};

export default OnboardingPage;
