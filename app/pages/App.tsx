/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-reanimated';
import '@/shared/ui/CustomAlert/AlertOverride';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import AppNavigator from '../navigation/AppNavigator';

import { styles } from './styles/App.styles';

import { getInitialReminderID, updateReminder } from '@/shared/utils/reminder';
import { AlertProvider } from '@/shared/ui/CustomAlert';
import BottomSheet from '@/shared/ui/BottomSheet/BottomSheet';
import { ThemeProvider } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { useOTAUpdate } from '@/shared/hooks/useOTAUpdate';

const App = (): React.JSX.Element => {
  const { version } = useOTAUpdate();
  const { notification } = useUser();

  useEffect(() => {
    version.onCheckVersion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const setReminder = async () => {
      if (!notification.active || !notification.time) {
        return;
      }
      const initialReminderID = await getInitialReminderID();

      if (initialReminderID) {
        updateReminder(initialReminderID, new Date(notification.time));
        return;
      }
    };

    setReminder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <ThemeProvider>
            <AlertProvider>
              <AppNavigator />
              <BottomSheet />
            </AlertProvider>
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
