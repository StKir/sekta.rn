import { View } from 'react-native';
import React from 'react';

import Text from '../Text';

import { useTheme } from '@/shared/theme';

type TagProps = {
  text: string;
  variant?: 'small' | 'normal';
};

const Tag = ({ text, variant = 'normal' }: TagProps) => {
  const { colors } = useTheme();

  if (variant === 'small') {
    return (
      <View
        style={{
          backgroundColor: colors.PRIMARY_ALPHA,
          paddingHorizontal: 15,
          paddingVertical: 12,
          borderRadius: 14,
        }}
      >
        <Text.Body2>{text}</Text.Body2>
      </View>
    );
  }

  return (
    <View
      style={{
        borderColor: colors.PRIMARY,
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 14,
      }}
    >
      <Text.Body1>{text}</Text.Body1>
    </View>
  );
};

export default Tag;
