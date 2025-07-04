/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import React from 'react';

import AppNavigator from '../navigation/AppNavigator';

import { styles } from './styles/App.styles';

import BottomSheet from '@/shared/ui/BottomSheet/BottomSheet';
import { ThemeProvider } from '@/shared/theme';

const App = (): React.JSX.Element => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <ThemeProvider>
          <StatusBar barStyle='dark-content' />
          <AppNavigator />
          <BottomSheet />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
