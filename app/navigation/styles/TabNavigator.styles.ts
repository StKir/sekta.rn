import { EdgeInsets } from 'react-native-safe-area-context';
import { TextStyle } from 'react-native';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { ThemeColors } from '@/shared/theme/types';
import { SIZES } from '@/shared/constants';

export const createNavigationOptions = (
  colors: ThemeColors,
  insets: EdgeInsets
): BottomTabNavigationOptions => ({
  tabBarActiveTintColor: colors.PRIMARY,
  tabBarInactiveTintColor: colors.GRAY_1,
  headerShown: false,
  tabBarStyle: {
    backgroundColor: colors.BACKGROUND_SECONDARY,
    position: 'absolute',
    height: SIZES.TAB_BAR_HEIGHT + insets.bottom,
    padding: 0,
    paddingTop: 10,
    opacity: 0.95,

    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    borderRadius: 24,
    // borderWidth: 2,
    borderColor: colors.BACKGROUND_SECONDARY,

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 5,
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
