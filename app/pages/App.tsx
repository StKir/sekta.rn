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
import AppMetrica from '@appmetrica/react-native-analytics';

import AppNavigator from '../navigation/AppNavigator';

import { styles } from './styles/App.styles';

import { getInitialReminderID, updateReminder } from '@/shared/utils/reminder';
import { Metrics } from '@/shared/utils/metrics';
import { AlertProvider } from '@/shared/ui/CustomAlert';
import BottomSheet from '@/shared/ui/BottomSheet/BottomSheet';
import { ThemeProvider } from '@/shared/theme';
import { useOTAUpdate } from '@/shared/hooks/useOTAUpdate';
import { APP_METRICA_KEY } from '@/env';
import { useUserStore } from '@/entities/user';

const App = (): React.JSX.Element => {
  const { version } = useOTAUpdate();
  const { notification } = useUserStore();

  useEffect(() => {
    version.onCheckVersion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    AppMetrica.activate({
      apiKey: APP_METRICA_KEY,
      sessionTimeout: 120,
      logs: true,
      crashReporting: true,
      firstActivationAsUpdate: false,
    });
    Metrics.appOpened();
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
