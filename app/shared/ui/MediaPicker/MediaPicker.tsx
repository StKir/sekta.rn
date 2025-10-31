/* eslint-disable @typescript-eslint/no-deprecated */
/* eslint-disable no-console */
import Icon from 'react-native-vector-icons/Ionicons';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { View, TouchableOpacity, FlatList, Alert, Platform, Linking } from 'react-native';
import React from 'react';

import { createStyles } from './MediaPicker.styles';

import { CameraPermissions, StoragePermissions } from '@/shared/utils/permissions';
import { MediaStorageService } from '@/shared/utils/mediaStorage';
import Text from '@/shared/ui/Text/Text';
import Photo from '@/shared/ui/Photo';
import { useTheme } from '@/shared/theme';
import { SIZES } from '@/shared/constants';

export type MediaItem = {
  id: string;
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
};

type MediaPickerProps = {
  value?: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  maxItems?: number;
};

const MediaPicker = ({ value = [], onChange, maxItems = 5 }: MediaPickerProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handlePickFromGallery = async () => {
    await StoragePermissions.request();
    launchGalleryWithType('mixed');
  };

  const handleCameraPhoto = async () => {
    const hasPermission = await CameraPermissions.requestWithAlert(false);
    if (!hasPermission) {
      return;
    }
    launchCameraWithType('photo');
  };

  const handleCameraVideo = async () => {
    const hasPermission = await CameraPermissions.requestWithAlert(true);
    if (!hasPermission) {
      return;
    }
    launchCameraWithType('video');
  };

  const launchCameraWithType = (mediaType: 'photo' | 'video') => {
    const options: CameraOptions = {
      mediaType: mediaType as MediaType,
      quality: 1 as const,
      maxWidth: 1920,
      maxHeight: 1920,
      includeBase64: false,
      videoQuality: 'high' as const,
      durationLimit: 30,
      presentationStyle: Platform.OS === 'ios' ? 'fullScreen' : undefined,
      includeExtra: true,
    };

    launchCamera(options, async (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        if (response.errorCode === 'permission') {
          Alert.alert(
            'Нет доступа',
            mediaType === 'video'
              ? 'Нет доступа к камере/микрофону. Разрешите в настройках.'
              : 'Нет доступа к камере. Разрешите в настройках.',
            [
              { text: 'Отмена', style: 'cancel' },
              { text: 'Открыть настройки', onPress: () => Linking.openSettings() },
            ]
          );
        } else if (response.errorCode === 'camera_unavailable') {
          Alert.alert('Камера недоступна', 'Проверьте разрешения или устройство.');
        } else {
          Alert.alert('Ошибка камеры', response.errorMessage || 'Не удалось открыть камеру');
        }
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const fileName = asset.fileName || `camera_${mediaType}_${Date.now()}`;

        try {
          const permanentPath = await MediaStorageService.saveMediaFile(asset.uri || '', fileName);

          const newMedia: MediaItem = {
            id: Date.now().toString(),
            uri: permanentPath,
            type: mediaType === 'photo' ? 'image' : 'video',
            fileName: fileName,
          };

          onChange([...value, newMedia]);
        } catch (error) {
          console.error('Failed to save media file:', error);
        }
      }
    });
  };

  const launchGalleryWithType = (mediaType: 'photo' | 'video' | 'mixed') => {
    const remainingSlots = maxItems - value.length;
    const selectionLimit = remainingSlots > 0 ? remainingSlots : 1;

    const options = {
      mediaType: mediaType as MediaType,
      quality: 0.8 as const,
      maxWidth: 1920,
      maxHeight: 1920,
      includeBase64: false,
      selectionLimit: selectionLimit,
      videoQuality: 'medium' as const,
      presentationStyle: Platform.OS === 'ios' ? 'fullScreen' : undefined,
      includeExtra: true,
    };

    launchImageLibrary(options as ImageLibraryOptions, async (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        if (response.errorCode === 'permission') {
          Alert.alert(
            'Нет доступа к медиа',
            'Разрешите доступ к Фото в настройках, чтобы выбрать медиа.',
            [
              { text: 'Отмена', style: 'cancel' },
              { text: 'Открыть настройки', onPress: () => Linking.openSettings() },
            ]
          );
        } else {
          Alert.alert('Ошибка галереи', response.errorMessage || 'Не удалось открыть галерею');
        }
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const newMediaItems: MediaItem[] = [];

        for (const asset of response.assets) {
          const isVideo = asset.type?.startsWith('video/');
          const fileName =
            asset.fileName ||
            `gallery_${isVideo ? 'video' : 'photo'}_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 5)}`;

          try {
            const permanentPath = await MediaStorageService.saveMediaFile(
              asset.uri || '',
              fileName
            );

            const newMedia: MediaItem = {
              id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              uri: permanentPath,
              type: isVideo ? 'video' : 'image',
              fileName: fileName,
            };

            newMediaItems.push(newMedia);
          } catch (error) {
            console.error('Failed to save media file:', error);
          }
        }

        if (newMediaItems.length > 0) {
          onChange([...value, ...newMediaItems]);
        }
      }
    });
  };

  const removeMedia = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const renderMediaItem = (item: MediaItem) => (
    <View key={item.id} style={styles.mediaItem}>
      {item.type === 'image' ? (
        <Photo style={styles.mediaPreview} uri={item.uri} />
      ) : (
        <View style={[styles.mediaPreview, styles.videoPreview]}>
          <Icon color={colors.TEXT_PRIMARY} name='play-circle' size={32} />
        </View>
      )}

      <TouchableOpacity style={styles.removeButton} onPress={() => removeMedia(item.id)}>
        <Icon color={colors.BACKGROUND_PRIMARY} name='close' size={14} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text color={colors.PRIMARY} variant='body1'>
        Добавить медиа
      </Text>
      {value.length < maxItems && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handlePickFromGallery}>
            <Icon color={colors.TEXT_PRIMARY} name='images' size={SIZES.ICON_SIZE_SMALL} />
            <Text color={colors.TEXT_PRIMARY} variant='body2'>
              Галерея
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCameraPhoto}>
            <Icon color={colors.TEXT_PRIMARY} name='camera' size={SIZES.ICON_SIZE_SMALL} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCameraVideo}>
            <Icon color={colors.TEXT_PRIMARY} name='videocam' size={SIZES.ICON_SIZE_SMALL} />
          </TouchableOpacity>
        </View>
      )}

      {value.length > 0 && (
        <FlatList
          horizontal
          data={value}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderMediaItem(item)}
          showsHorizontalScrollIndicator={false}
          style={styles.mediaList}
        />
      )}
    </View>
  );
};

export default MediaPicker;
