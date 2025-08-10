/* eslint-disable react-native/split-platform-components */
import { Alert, Platform, Linking } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

interface UseScreenshotShareProps {
  openGalleryAfterSave?: boolean;
}

export const useScreenshotShare = ({
  openGalleryAfterSave = false,
}: UseScreenshotShareProps = {}) => {
  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        return true;
      } else if (Platform.Version >= 29) {
        return true;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Разрешение на сохранение',
            message: 'Приложению нужно разрешение для сохранения изображений в галерею',
            buttonPositive: 'Разрешить',
            buttonNegative: 'Отмена',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch {
      return false;
    }
  };

  const createScreenshot = async (viewShotRef: any): Promise<string | null> => {
    try {
      const viewShot = viewShotRef.current;
      if (!viewShot || !viewShot.capture) {
        Alert.alert('Ошибка', 'Не удается создать скриншот');
        return null;
      }

      const uri = await viewShot.capture();
      return uri;
    } catch {
      Alert.alert('Ошибка', 'Не удалось создать скриншот. Попробуйте еще раз.');
      return null;
    }
  };

  const saveToGallery = async (uri: string): Promise<boolean> => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Ошибка', 'Необходимо разрешение для сохранения в галерею');
        return false;
      }

      const file = await CameraRoll.saveAsset(uri, {
        type: 'photo',
        album: 'sekta',
      });

      if (openGalleryAfterSave) {
        setTimeout(() => {
          Linking.openURL(file.node.image.uri);
        }, 500);
      }

      return true;
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить изображение в галерею');
      return false;
    }
  };

  const handleShare = async (viewShotRef: any) => {
    const uri = await createScreenshot(viewShotRef);
    if (uri) {
      await saveToGallery(uri);
    }
  };

  return {
    handleShare,
    createScreenshot,
    saveToGallery,
  };
};
