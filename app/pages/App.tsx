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
import notifee from '@notifee/react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import AppNavigator from '../navigation/AppNavigator';

import { styles } from './styles/App.styles';

import { getInitialReminderID, updateReminder } from '@/shared/utils/reminder';
import BottomSheet from '@/shared/ui/BottomSheet/BottomSheet';
import { ThemeProvider } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { useUserStore } from '@/entities/user/store/userStore';

const App = (): React.JSX.Element => {
  const { notification } = useUser();
  const { setAiTokens, userTime, setUserTime } = useUserStore();

  useEffect(() => {
    if (!userTime) {
      setUserTime();
      setAiTokens(4);
      return;
    }

    if (userTime.getDay() !== new Date().getDay()) {
      setUserTime();
      setAiTokens(4);
    }
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
            <AppNavigator />
            <BottomSheet />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
