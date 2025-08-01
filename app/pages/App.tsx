/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-reanimated';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import AppNavigator from '../navigation/AppNavigator';

import { styles } from './styles/App.styles';

import { MediaMigrationService } from '@/shared/utils/mediaMigration';
import BottomSheet from '@/shared/ui/BottomSheet/BottomSheet';
import { ThemeProvider } from '@/shared/theme';

const App = (): React.JSX.Element => {
  useEffect(() => {
    const runMigration = async () => {
      await MediaMigrationService.migrateExistingMedia();
      await MediaMigrationService.cleanupTemporaryFiles();
    };

    runMigration();
  }, []);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <ThemeProvider>
            <AppNavigator />
            <BottomSheet />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
