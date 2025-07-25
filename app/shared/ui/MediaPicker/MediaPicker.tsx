import Icon from 'react-native-vector-icons/Ionicons';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';
import { View, TouchableOpacity, Image, FlatList } from 'react-native';
import React from 'react';

import { createStyles } from './MediaPicker.styles';

import { CameraPermissions, StoragePermissions } from '@/shared/utils/permissions';
import Text from '@/shared/ui/Text/Text';
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
    const options = {
      mediaType: mediaType as MediaType,
      quality: 1 as const,
      maxWidth: 1920,
      maxHeight: 1920,
      includeBase64: false,
      videoQuality: 'high' as const,
      durationLimit: 30,
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

  const launchGalleryWithType = (mediaType: 'photo' | 'video' | 'mixed') => {
    const options = {
      mediaType: mediaType as MediaType,
      quality: 0.8 as const,
      maxWidth: 1920,
      maxHeight: 1920,
      includeBase64: false,
      selectionLimit: 1,
      videoQuality: 'medium' as const,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const isVideo = asset.type?.startsWith('video/');
        const newMedia: MediaItem = {
          id: Date.now().toString(),
          uri: asset.uri || '',
          type: isVideo ? 'video' : 'image',
          fileName: asset.fileName || `gallery_${isVideo ? 'video' : 'photo'}_${Date.now()}`,
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
          <Icon color={colors.TEXT_PRIMARY} name='play-circle' size={32} />
        </View>
      )}

      <TouchableOpacity style={styles.removeButton} onPress={() => removeMedia(item.id)}>
        <Icon color='white' name='close' size={14} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text color='primary' variant='body1'>
        Добавить медиа
      </Text>
      {value.length < maxItems && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handlePickFromGallery}>
            <Icon color={colors.TEXT_PRIMARY} name='images' size={SIZES.ICON_SIZE_SMALL} />
            <Text color='textPrimary' variant='body2'>
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
