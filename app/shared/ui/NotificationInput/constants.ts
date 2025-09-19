/* eslint-disable react-native/split-platform-components */
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import notifee from '@notifee/react-native';

export const BUTTON_TEXTS = {
  ENABLE: 'Включить уведомления',
  DISABLE: 'Отключить уведомления',
};

export const LABELS = {
  TIME: 'Время уведомления',
  SELECT_TIME: 'Выберите время',
  PERMISSION_DENIED:
    'Разрешение на уведомления отклонено. Вы можете изменить это в настройках устройства.',
};

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Уведомления отклонены');
    }

    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  if (Platform.OS === 'ios') {
    const settings = await notifee.requestPermission({
      sound: true,
      announcement: true,
      badge: true,
      criticalAlert: false,
      alert: true,
      provisional: false,
    });

    const granted = settings.authorizationStatus;

    if (!granted) {
      Alert.alert('Уведомления отклонены');
    }

    return granted;
  }

  return true;
};
