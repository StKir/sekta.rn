import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfilePage from '@/pages/ProfilePage';
import CheckInPage from '@/pages/CheckInPage';
import CalendarPage from '@/pages/CalendarPage';

import { TabParamList } from './types';
import { createNavigationOptions } from './styles/TabNavigator.styles';

import BottomSheetManager from '@/shared/ui/BottomSheet/BottomSheetManager';
import { useTheme } from '@/shared/theme';
import { SIZES } from '@/shared/constants';
import AddRecordContent from '@/features/forms/AddRecordContent/AddRecordContent';

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
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name='calendar-outline' size={size} />
          ),
        }}
      />
      <Tab.Screen
        component={CheckInPage}
        name='CheckIn'
        options={{
          tabBarLabel: () => null,
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={{
                backgroundColor: colors.PRIMARY_ALPHA,
                width: 60,
                height: 60,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                BottomSheetManager.show(<AddRecordContent />);
              }}
            >
              {props.children}
            </TouchableOpacity>
          ),
          tabBarIcon: () => (
            <Ionicons
              color={colors.PRIMARY}
              name='add-circle-outline'
              size={SIZES.ICON_SIZE_MEDIUM}
            />
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
