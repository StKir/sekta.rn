import { View } from 'react-native';
import React from 'react';

import Text from '../Text';

import { useTheme } from '@/shared/theme';

type TagProps = {
  text: string;
};

const Tag = ({ text }: TagProps) => {
  const { colors } = useTheme();
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
