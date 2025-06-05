import { Platform } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '../shared/theme';
import { SIZES } from '../shared/constants';
import WeekSliderDemo from '../pages/WeekSliderDemo';
import ProfilePage from '../pages/ProfilePage';
import EventsPage from '../pages/EventsPage';
// import CalendarPage from '../pages/CalendarPage';

import { TabParamList } from './types';
import { createNavigationOptions } from './styles/TabNavigator.styles';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { colors } = useTheme();
  const baseOptions = createNavigationOptions(colors);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.PRIMARY,
        tabBarInactiveTintColor: colors.GRAY_1,
        headerShown: false,
        tabBarStyle: {
          height: SIZES.TAB_BAR_HEIGHT + (Platform.OS === 'ios' ? 30 : 20),
          backgroundColor: colors.BACKGROUND_PRIMARY,
          borderTopColor: colors.SEPARATOR,
        },
        headerStyle: baseOptions.headerStyle,
        headerTitleStyle: baseOptions.headerTitleStyle,
        headerTintColor: baseOptions.headerTintColor,
        ...baseOptions,
      }}
    >
      <Tab.Screen component={EventsPage} name='Events' />
      <Tab.Screen component={WeekSliderDemo} name='Calendar' />
      <Tab.Screen component={ProfilePage} name='Profile' />
    </Tab.Navigator>
  );
};

export default TabNavigator;
