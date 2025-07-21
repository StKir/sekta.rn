import Icon from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet, Text } from 'react-native';
import React from 'react';

import Video from '@/shared/ui/Video';
import Photo from '@/shared/ui/Photo';
import { MediaItem } from '@/shared/ui/MediaPicker/MediaPicker';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { useTheme } from '@/shared/theme';

type MediaLentProps = {
  media?: MediaItem[] | MediaItem;
};

const MediaLent = ({ media }: MediaLentProps) => {
  const { colors } = useTheme();

  if (!media) {
    return null;
  }

  // Приводим к массиву для единообразной обработки
  const mediaItems = Array.isArray(media) ? media : [media];
  const currentMedia = mediaItems[0];

  const renderMediaItem = (item: MediaItem) => {
    if (item.type === 'image') {
      return <Photo style={styles.mediaImage} uri={item.uri} />;
    }

    return (
      <Video
        autoPlay={true}
        muted={true}
        repeat={true}
        showControls={true}
        style={styles.videoContainer}
        uri={item.uri}
      />
    );
  };

  return (
    <MainContainer>
      <View style={styles.container}>
        {renderMediaItem(currentMedia)}

        {mediaItems.length > 1 && (
          <View style={[styles.mediaCounter, { backgroundColor: colors.PRIMARY }]}>
            <Icon color={colors.BACKGROUND_PRIMARY} name='images' size={16} />
            <Text style={[styles.counterText, { color: colors.BACKGROUND_PRIMARY }]}>
              +{mediaItems.length - 1}
            </Text>
          </View>
        )}
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 272,
    borderRadius: 24,
    overflow: 'hidden',
  },
  defaultImage: {
    width: '100%',
    height: 272,
    borderRadius: 24,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  mediaCounter: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MediaLent;
