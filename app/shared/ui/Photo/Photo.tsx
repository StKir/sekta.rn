import { Image, ImageStyle, ImageResizeMode, View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';

import { MediaStorageService } from '@/shared/utils/mediaStorage';

type PhotoProps = {
  uri: string;
  style?: ImageStyle;
  resizeMode?: ImageResizeMode;
};

const Photo = ({ uri, style, resizeMode = 'cover' }: PhotoProps) => {
  const [imageExists, setImageExists] = useState(true);
  const [actualUri, setActualUri] = useState(uri);

  useEffect(() => {
    const checkImageExists = async () => {
      if (uri.startsWith('/')) {
        const exists = await MediaStorageService.fileExists(uri);
        if (exists) {
          setActualUri(MediaStorageService.getFileUri(uri));
          setImageExists(true);
        } else {
          setImageExists(false);
        }
      } else {
        setActualUri(uri);
        setImageExists(true);
      }
    };

    checkImageExists();
  }, [actualUri, uri]);

  if (!imageExists) {
    return (
      <View
        style={[
          style,
          {
            backgroundColor: '#f0f0f0',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
          },
        ]}
      >
        <Text style={{ color: '#666', fontSize: 14 }}>Изображение недоступно</Text>
      </View>
    );
  }

  return (
    <Image
      resizeMode={resizeMode}
      source={{ uri: actualUri }}
      style={style}
      onError={() => setImageExists(false)}
    />
  );
};

export default Photo;
