/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

import AppNavigator from '../navigation/AppNavigator';

import { styles } from './styles/App.styles';

import { ThemeProvider } from '@/shared/theme';

const App = (): React.JSX.Element => {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar barStyle='dark-content' />
        <ThemeProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </ApplicationProvider>
  );
};

export default App;
