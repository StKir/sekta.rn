import ViewShot from 'react-native-view-shot';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity, Alert, Platform } from 'react-native';
import { Share as RNShare } from 'react-native';
import React, { useRef } from 'react';

import { useTheme } from '@/shared/theme';

type ShareProps = {
  children: React.ReactNode;
  title?: string;
  message?: string;
  iconSize?: number;
  iconColor?: string;
  buttonStyle?: any;
};

const Share = ({
  children,
  title = 'Поделиться постом',
  message = 'Посмотри на мой пост!',
  iconSize = 24,
  iconColor,
  buttonStyle,
}: ShareProps) => {
  const { colors } = useTheme();
  const viewShotRef = useRef<ViewShot>(null);

  const handleShare = async () => {
    try {
      const viewShot = viewShotRef.current;
      if (!viewShot || !viewShot.capture) {
        Alert.alert('Ошибка', 'Не удается создать скриншот');
        return;
      }

      // Создаем скриншот в base64 для лучшей совместимости
      const base64 = await viewShot.capture();

      console.log('Screenshot created (base64):', base64.substring(0, 50) + '...');

      // Для отправки изображения используем data URI
      const imageDataUri = `data:image/png;base64,${base64}`;

      if (Platform.OS === 'ios') {
        // iOS - отправляем изображение через url как data URI
        await RNShare.share({
          url: imageDataUri,
        });
      } else {
        // Android - отправляем через url как data URI
        await RNShare.share({
          url: imageDataUri,
        });
      }

      console.log('Изображение успешно отправлено');
    } catch (error: any) {
      console.error('Ошибка при отправке изображения:', error);

      // Fallback - создаем файл и пробуем еще раз
      try {
        const viewShot = viewShotRef.current;
        if (viewShot && viewShot.capture) {
          // Пробуем создать временный файл
          const uri = await viewShot.capture();

          await RNShare.share({
            message: message,
            url: Platform.OS === 'ios' ? uri : `file://${uri}`,
          });
        }
      } catch {
        // Последний fallback - только текст
        try {
          await RNShare.share({
            message: message,
            title: title,
          });
        } catch {
          Alert.alert('Ошибка', 'Не удалось поделиться изображением. Попробуйте еще раз.');
        }
      }
    }
  };

  return (
    <View style={{ position: 'relative' }}>
      {/* Скриншот контейнер */}
      <ViewShot
        options={{
          format: 'png',
          quality: 0.9,
          result: 'base64',
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
            backgroundColor: colors.BACKGROUND_PRIMARY,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          buttonStyle,
        ]}
        onPress={handleShare}
      >
        <Icon color={iconColor || colors.GRAY_1} name='share-social' size={iconSize} />
      </TouchableOpacity>
    </View>
  );
};

export default Share;
