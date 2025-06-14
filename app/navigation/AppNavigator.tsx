import { View, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import RegisterPage from '@/pages/RegisterPage';

import { RootStackParamList } from './types';
import TabNavigator from './TabNavigator';

import { StorageService } from '@/shared/utils/storage';
import { useTheme } from '@/shared/theme';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasUser, setHasUser] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const userExists = await StorageService.hasUser();
      setHasUser(userExists);
    } catch (error) {
      console.error('Error checking user status:', error);
      setHasUser(false);
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
        <Stack.Screen component={RegisterPage} name='Register' />
        <Stack.Screen component={TabNavigator} name='TabNavigator' />
      </Stack.Navigator>
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
