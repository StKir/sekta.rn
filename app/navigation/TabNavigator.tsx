import Ionicons from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfilePage from '@/pages/ProfilePage';
import EventsPage from '@/pages/EventsPage';
import CalendarPage from '@/pages/CalendarPage';

import { TabParamList } from './types';
import { createNavigationOptions } from './styles/TabNavigator.styles';

import { useTheme } from '@/shared/theme';
import { SIZES } from '@/shared/constants';

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
      <Tab.Screen
        component={EventsPage}
        name='Events'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name='list-outline' size={size} />
          ),
        }}
      />
      <Tab.Screen
        component={CalendarPage}
        name='Calendar'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name='calendar-outline' size={size} />
          ),
        }}
      />
      <Tab.Screen
        component={ProfilePage}
        name='Profile'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name='person-outline' size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
