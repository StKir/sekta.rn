import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import {RootStackParamList} from './types';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen component={TabNavigator} name="TabNavigator" />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
