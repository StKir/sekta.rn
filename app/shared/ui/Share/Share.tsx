import ViewShot from 'react-native-view-shot';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity, Alert, Platform, PermissionsAndroid, Linking } from 'react-native';
import React, { useRef } from 'react';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

import { useTheme } from '@/shared/theme';

type ShareProps = {
  children: React.ReactNode;
  title?: string;
  message?: string;
  iconSize?: number;
  iconColor?: string;
  buttonStyle?: any;
  showOptionsMenu?: boolean; // Показывать ли меню выбора действий
  openGalleryAfterSave?: boolean; // Открывать ли галерею после сохранения
};

const Share = ({
  children,
  iconSize = 24,
  iconColor,
  buttonStyle,
  openGalleryAfterSave = true, // По умолчанию открываем галерею после сохранения
}: ShareProps) => {
  const { colors } = useTheme();
  const viewShotRef = useRef<ViewShot>(null);

  // Запрос разрешений для Android
  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        // Android 13+ не требует разрешения для сохранения в медиа
        return true;
      } else if (Platform.Version >= 29) {
        // Android 10-12 - используем scoped storage
        return true;
      } else {
        // Android 9 и ниже - требуется разрешение
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
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Создание скриншота
  const createScreenshot = async (): Promise<string | null> => {
    try {
      const viewShot = viewShotRef.current;
      if (!viewShot || !viewShot.capture) {
        Alert.alert('Ошибка', 'Не удается создать скриншот');
        return null;
      }

      const uri = await viewShot.capture();

      console.log('Screenshot created:', uri);
      return uri;
    } catch (error: any) {
      console.error('Ошибка при создании скриншота:', error);
      Alert.alert('Ошибка', 'Не удалось создать скриншот. Попробуйте еще раз.');
      return null;
    }
  };

  // Сохранение в галерею
  const saveToGallery = async (uri: string): Promise<boolean> => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Ошибка', 'Необходимо разрешение для сохранения в галерею');
        return false;
      }

      const file = await CameraRoll.saveAsset(uri, {
        type: 'photo',
        album: 'Camera Roll',
      });

      if (openGalleryAfterSave) {
        Linking.openURL(file.node.image.uri);
      }

      return true;
    } catch (saveError: any) {
      console.error('Ошибка при сохранении в галерею:', saveError);
      Alert.alert('Ошибка', 'Не удалось сохранить изображение в галерею');
      return false;
    }
  };

  // Обработчик нажатия (по умолчанию - сохранение и шаринг)
  const handleShare = async () => {
    const uri = await createScreenshot();
    if (uri) {
      await saveToGallery(uri);
    }
  };

  return (
    <View style={{ position: 'relative' }}>
      {/* Скриншот контейнер */}
      <ViewShot
        options={{
          format: 'png',
          quality: 0.9,
          result: 'tmpfile',
        }}
        ref={viewShotRef}
      >
        {children}
      </ViewShot>

      {/* Кнопка шеринга */}
      <TouchableOpacity
        style={[
          {
            position: 'absolute',
            top: 12,
            right: 12,
            width: 30,
            height: 30,
            borderRadius: 5,
            borderColor: colors.PRIMARY_ALPHA,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          buttonStyle,
        ]}
        onPress={handleShare}
      >
        <Icon color={iconColor || colors.PRIMARY} name='share' size={iconSize} />
      </TouchableOpacity>
    </View>
  );
};

export default Share;
