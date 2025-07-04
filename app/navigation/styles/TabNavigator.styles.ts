import { TextStyle } from 'react-native';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { ThemeColors } from '@/shared/theme/types';
import { SIZES, SPACING } from '@/shared/constants';

export const createNavigationOptions = (colors: ThemeColors): BottomTabNavigationOptions => ({
  tabBarActiveTintColor: colors.PRIMARY,
  tabBarInactiveTintColor: colors.GRAY_1,
  headerShown: false,
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    height: SIZES.TAB_BAR_HEIGHT,
    paddingTop: SPACING.MEDIUM,
    borderRadius: 24,
    backgroundColor: colors.BACKGROUND_PRIMARY,
    shadowColor: colors.SHADOW,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderTopWidth: 0,
  },
  headerStyle: {
    backgroundColor: colors.BACKGROUND_PRIMARY,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    color: colors.TEXT_PRIMARY,
    fontWeight: 'bold',
    fontSize: SIZES.FONT_SIZE.MEDIUM,
  } as TextStyle,
  headerTintColor: colors.BACKGROUND_PRIMARY,
});
