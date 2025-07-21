/* eslint-disable react-native/split-platform-components */
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React from 'react';

import Text from '@/shared/ui/Text/Text';
import { Button } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';

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

  const requestCameraPermission = async (includeAudio = false): Promise<boolean> => {
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
  };

  const requestStoragePermission = async (): Promise<boolean> => {
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
  };

  const handlePickMedia = () => pickFromGallery();

  const pickFromCamera = async () => {
    Alert.alert('Тип медиа', 'Что хотите снять?', [
      { text: 'Фото', onPress: () => handleCameraPhoto() },
      { text: 'Видео', onPress: () => handleCameraVideo() },
      { text: 'Отмена', style: 'cancel' },
    ]);
  };

  const handleCameraPhoto = async () => {
    const hasPermission = await requestCameraPermission(false);
    if (!hasPermission) {
      Alert.alert('Ошибка', 'Нет доступа к камере');
      return;
    }
    launchCameraWithType('photo');
  };

  const handleCameraVideo = async () => {
    const hasPermission = await requestCameraPermission(true);
    if (!hasPermission) {
      Alert.alert('Ошибка', 'Нет доступа к камере и микрофону');
      return;
    }
    launchCameraWithType('video');
  };

  const pickFromGallery = async () => {
    await requestStoragePermission();

    launchGalleryWithType('photo');
  };

  const launchCameraWithType = (mediaType: 'photo' | 'video') => {
    const options = {
      mediaType: mediaType as MediaType,
      quality: 0.8 as const,
      maxWidth: 1920,
      maxHeight: 1920,
      includeBase64: false,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const newMedia: MediaItem = {
          id: Date.now().toString(),
          uri: asset.uri || '',
          type: mediaType === 'photo' ? 'image' : 'video',
          fileName: asset.fileName || `camera_${mediaType}_${Date.now()}`,
        };

        onChange([...value, newMedia]);
      }
    });
  };

  const launchGalleryWithType = (mediaType: 'photo' | 'video') => {
    const options = {
      mediaType: mediaType as MediaType,
      quality: 0.8 as const,
      maxWidth: 1920,
      maxHeight: 1920,
      includeBase64: false,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const newMedia: MediaItem = {
          id: Date.now().toString(),
          uri: asset.uri || '',
          type: mediaType === 'photo' ? 'image' : 'video',
          fileName: asset.fileName || `gallery_${mediaType}_${Date.now()}`,
        };

        onChange([...value, newMedia]);
      }
    });
  };

  const removeMedia = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const renderMediaItem = (item: MediaItem) => (
    <View key={item.id} style={styles.mediaItem}>
      {item.type === 'image' ? (
        <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
      ) : (
        <View style={[styles.mediaPreview, styles.videoPreview]}>
          <Text color='textPrimary' variant='body2'>
            📹
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.removeButton} onPress={() => removeMedia(item.id)}>
        <Text color='textPrimary' variant='body2'>
          ✕
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
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

      {value.length < maxItems && (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Button title='Добавить медиа' variant='outline' onPress={handlePickMedia} />
          <Button title='Снять видео' variant='outline' onPress={pickFromCamera} />
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: 16,
    },
    mediaList: {
      flexDirection: 'row',
    },
    mediaItem: {
      position: 'relative',
      marginRight: 12,
    },
    mediaPreview: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: colors.BACKGROUND_SECONDARY,
    },
    videoPreview: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.TEXT_SECONDARY,
    },
    removeButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#FF3B30',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default MediaPicker;
