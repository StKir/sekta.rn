import RNVideo from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity, ViewStyle, Text } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

import { MediaStorageService } from '@/shared/utils/mediaStorage';
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
  const [isFullScreen, setFullScreen] = useState(false);
  const [isShow, setShow] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [videoExists, setVideoExists] = useState(true);
  const [actualUri, setActualUri] = useState(uri);
  const videoRef = useRef<any>(null);

  useEffect(() => {
    const checkVideoExists = async () => {
      if (uri.startsWith('/')) {
        const exists = await MediaStorageService.fileExists(uri);
        if (exists) {
          setActualUri(MediaStorageService.getFileUri(uri));
          setVideoExists(true);
        } else {
          setVideoExists(false);
        }
      } else {
        setActualUri(uri);
        setVideoExists(true);
      }
    };

    checkVideoExists();
  }, [uri]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted && videoRef.current) {
      videoRef.current.seek(0);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      videoRef.current.presentFullscreenPlayer();
    }
  };

  if (!videoExists) {
    return (
      <View
        style={[
          {
            backgroundColor: '#f0f0f0',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
          },
          style,
        ]}
      >
        <Icon color='#666' name='videocam-off' size={48} />
        <Text style={{ color: '#666', fontSize: 14, marginTop: 8 }}>Видео недоступно</Text>
      </View>
    );
  }

  return (
    <View style={[{ position: 'relative' }, style]}>
      {isShow ? (
        <RNVideo
          controls={isFullScreen}
          fullscreenAutorotate={true}
          fullscreenOrientation='all'
          muted={isMuted}
          paused={!autoPlay}
          playInBackground={false}
          playWhenInactive={false}
          ref={videoRef}
          repeat={repeat}
          resizeMode='cover'
          source={{ uri: actualUri }}
          style={{ width: '100%', height: '100%' }}
          onEnd={() => !isFullScreen && setShow(false)}
          onError={(error: any) => {
            console.log('Video error:', error);
            setVideoExists(false);
          }}
          onFullscreenPlayerDidDismiss={() => setFullScreen(false)}
          onFullscreenPlayerDidPresent={() => setFullScreen(true)}
        />
      ) : (
        <TouchableOpacity
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: colors.PRIMARY_ALPHA,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setShow(true)}
        >
          <Icon name='play' size={48} />
        </TouchableOpacity>
      )}

      {isShow && showControls && (
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
