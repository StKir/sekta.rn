import { Image, ImageStyle, ImageResizeMode } from 'react-native';
import React from 'react';

type PhotoProps = {
  uri: string;
  style?: ImageStyle;
  resizeMode?: ImageResizeMode;
};

const Photo = ({ uri, style, resizeMode = 'cover' }: PhotoProps) => {
  return <Image resizeMode={resizeMode} source={{ uri }} style={style} />;
};

export default Photo;
