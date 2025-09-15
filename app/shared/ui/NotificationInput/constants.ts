/* eslint-disable react-native/split-platform-components */
import { Platform, PermissionsAndroid, Alert } from 'react-native';

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

  // if (Platform.OS === 'ios') {
  //   const authStatus = await messaging().requestPermission({
  //     sound: true,
  //     provisional: true,
  //   });

  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (!enabled) {
  //     Alert.alert(i18n.t('common:notification'));
  //   }

  //   return enabled;
  // }

  return true;
};
