/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import React from 'react';

import { ThemeProvider } from '../shared/theme';
import AppNavigator from '../navigation/AppNavigator';

import { styles } from './styles/App.styles';

const App = (): React.JSX.Element => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <ThemeProvider>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
