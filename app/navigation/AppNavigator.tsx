import { View, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import NewRegisterPage from '@/pages/NewRegisterPage';
import JsonFormPage from '@/pages/JsonFormPage';
import CheckInPage from '@/pages/CheckInPage';

import { RootStackParamList } from './types';
import TabNavigator from './TabNavigator';

import { StorageService } from '@/shared/utils/storage';
import BottomSheet from '@/shared/ui/BottomSheet/BottomSheet';
import { useTheme } from '@/shared/theme';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useTheme();
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = () => {
    try {
      const userExists = StorageService.hasUser();

      setHasUser(userExists);
    } catch (error) {
      console.error('Error checking user status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.BACKGROUND_PRIMARY }]}>
        <ActivityIndicator color={colors.PRIMARY} size='large' />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={hasUser ? 'TabNavigator' : 'Register'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen component={NewRegisterPage} name='Register' />
        <Stack.Screen component={TabNavigator} name='TabNavigator' />
        <Stack.Screen component={JsonFormPage} name='JsonFormPage' />
        <Stack.Screen component={CheckInPage} name='CheckInPage' />
      </Stack.Navigator>
      <BottomSheet />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
