import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfilePage from '@/pages/ProfilePage';
import CheckInPage from '@/pages/CheckInPage';
import CalendarPage from '@/pages/CalendarPage';

import AddRecordContent from '@/components/AddRecordContent/AddRecordContent';

import { TabParamList } from './types';
import { createNavigationOptions } from './styles/TabNavigator.styles';

import BottomSheetManager from '@/shared/ui/BottomSheet/BottomSheetManager';
import { useTheme } from '@/shared/theme';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { colors } = useTheme();
  const baseOptions = createNavigationOptions(colors);

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
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name='calendar-outline' size={size} />
          ),
        }}
      />
      <Tab.Screen
        component={CheckInPage}
        name='CheckIn'
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                BottomSheetManager.show(<AddRecordContent />);
              }}
            >
              {props.children}
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name='add-circle-outline' size={size} />
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
