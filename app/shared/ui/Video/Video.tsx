import RNVideo from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import React, { useState, useRef } from 'react';

import { useTheme } from '@/shared/theme';

type VideoProps = {
  uri: string;
  style?: ViewStyle;
  showControls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  repeat?: boolean;
};

const Video = ({
  uri,
  style,
  showControls = true,
  autoPlay = true,
  muted = true,
  repeat = true,
}: VideoProps) => {
  const { colors } = useTheme();
  const [isMuted, setIsMuted] = useState(muted);
  const videoRef = useRef<any>(null);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Перезапускаем видео при включении звука
    if (isMuted && videoRef.current) {
      videoRef.current.seek(0);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      videoRef.current.presentFullscreenPlayer();
    }
  };

  return (
    <View style={[{ position: 'relative' }, style]}>
      <RNVideo
        controls={true}
        fullscreenAutorotate={true}
        fullscreenOrientation='all'
        muted={isMuted}
        paused={!autoPlay}
        playInBackground={false}
        playWhenInactive={false}
        ref={videoRef}
        repeat={repeat}
        resizeMode='cover'
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        onError={(error: any) => console.log('Video error:', error)}
      />

      {showControls && (
        <>
          {/* Контролы видео */}
          <View
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.PRIMARY,
                opacity: 0.9,
              }}
              onPress={toggleMute}
            >
              <Icon
                color={colors.BACKGROUND_PRIMARY}
                name={isMuted ? 'volume-mute' : 'volume-high'}
                size={20}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.PRIMARY,
                opacity: 0.9,
              }}
              onPress={toggleFullScreen}
            >
              <Icon color={colors.BACKGROUND_PRIMARY} name='expand' size={20} />
            </TouchableOpacity>
          </View>

          {/* Индикатор видео */}
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              opacity: 0.8,
            }}
          >
            <Icon color={colors.BACKGROUND_PRIMARY} name='play-circle' size={24} />
          </View>
        </>
      )}
    </View>
  );
};

export default Video;
