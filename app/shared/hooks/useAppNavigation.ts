import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '@/navigation/types';

export const useAppNavigation = () => {
  return useNavigation<StackNavigationProp<RootStackParamList>>();
};
