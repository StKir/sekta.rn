// eslint-disable-next-line react-native/split-platform-components
import { Platform, PermissionsAndroid, Alert } from 'react-native';

export class CameraPermissions {
  static async request(includeAudio = false): Promise<boolean> {
    if (Platform.OS === 'ios') {
      return true;
    }

    try {
      const permissions = [PermissionsAndroid.PERMISSIONS.CAMERA];
      if (includeAudio) {
        permissions.push(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      }

      if (permissions.length === 1) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: 'Разрешение на камеру',
          message: 'Приложению нужен доступ к камере для съемки фото и видео',
          buttonNeutral: 'Спросить позже',
          buttonNegative: 'Отмена',
          buttonPositive: 'Разрешить',
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const results = await PermissionsAndroid.requestMultiple(permissions);
        return (
          results[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
          (!includeAudio ||
            results[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
              PermissionsAndroid.RESULTS.GRANTED)
        );
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  static async requestWithAlert(includeAudio = false): Promise<boolean> {
    const hasPermission = await this.request(includeAudio);
    if (!hasPermission) {
      const message = includeAudio ? 'Нет доступа к камере и микрофону' : 'Нет доступа к камере';
      Alert.alert('Ошибка', message);
      return false;
    }
    return true;
  }
}

export class StoragePermissions {
  static async request(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      return true;
    }

    try {
      if (typeof Platform.Version === 'number' && Platform.Version >= 33) {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ];

        const results = await PermissionsAndroid.requestMultiple(permissions);
        return (
          results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED ||
          results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Разрешение на доступ к галерее',
            message: 'Приложению нужен доступ к галерее для выбора фото и видео',
            buttonNeutral: 'Спросить позже',
            buttonNegative: 'Отмена',
            buttonPositive: 'Разрешить',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
}
