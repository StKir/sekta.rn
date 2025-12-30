import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '@/navigation/types';
import Onboarding from '@/features/onboarding/Onboarding/Onboarding';
import { useUserStore } from '@/entities/user';

const OnboardingPage = () => {
  const { userData } = useUserStore();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleComplete = () => {
    if (!userData) {
      navigation.navigate('Register');
      return;
    }
    navigation.navigate('TabNavigator');
  };

  return <Onboarding onComplete={handleComplete} />;
};

export default OnboardingPage;
