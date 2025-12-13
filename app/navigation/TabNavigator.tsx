import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfilePage from '@/pages/ProfilePage';
import CalendarPage from '@/pages/CalendarPage';
import AiChatPage from '@/pages/AiChatPage';

import { TabParamList } from './types';
import { createNavigationOptions } from './styles/TabNavigator.styles';

import { useTheme } from '@/shared/theme';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const baseOptions = createNavigationOptions(colors, insets);

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: baseOptions.headerStyle,
        headerTitleStyle: baseOptions.headerTitleStyle,
        headerTintColor: baseOptions.headerTintColor,
        ...baseOptions,
      }}
    >
      <Tab.Screen
        component={CalendarPage}
        name='Calendar'
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name='calendar-outline' size={size} />
          ),
        }}
      />
      <Tab.Screen
        component={AiChatPage}
        name='AiChatPage'
        options={{
          tabBarLabel: () => null,
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={{
                width: 50,
                height: 50,
              }}
            >
              {props.children}
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <Icon color={color} name='chatbubbles-outline' size={size} />
          ),
        }}
      />
      <Tab.Screen
        component={ProfilePage}
        name='Profile'
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name='person-outline' size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
