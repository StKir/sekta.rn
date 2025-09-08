import { View, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import NewRegisterPage from '@/pages/NewRegisterPage';
import MomentPage from '@/pages/MomentPage';
import JsonFormPage from '@/pages/JsonFormPage';
import CheckInPage from '@/pages/CheckInPage';
import AIResultPage from '@/pages/AIResultPage';

import { RootStackParamList } from './types';
import TabNavigator from './TabNavigator';

import BottomSheet from '@/shared/ui/BottomSheet/BottomSheet';
import { useTheme } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { colors } = useTheme();
  const { isAuthenticated, isLoading, loadUser } = useUser();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

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
        initialRouteName={isAuthenticated ? 'TabNavigator' : 'Register'}
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      >
        <Stack.Screen component={NewRegisterPage} name='Register' />
        <Stack.Screen component={TabNavigator} name='TabNavigator' />
        <Stack.Screen component={JsonFormPage} name='JsonFormPage' />
        <Stack.Screen component={CheckInPage} name='CheckInPage' />
        <Stack.Screen component={MomentPage} name='MomentPage' />
        <Stack.Screen component={AIResultPage} name='AIResultPage' />
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
