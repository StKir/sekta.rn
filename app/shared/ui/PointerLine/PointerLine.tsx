import { View, StyleSheet } from 'react-native';
import React from 'react';

import { useTheme } from '@/shared/theme';

type PointerLineProps = {
  offset?: number;
  offsetTop?: number;
  offsetBottom?: number;
};

const PointerLine = ({ offset, offsetTop, offsetBottom }: PointerLineProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors, offset, offsetTop, offsetBottom);

  return <View style={styles.line} />;
};

const createStyles = (
  colors: ThemeColors,
  offset?: number,
  offsetTop?: number,
  offsetBottom?: number
) =>
  StyleSheet.create({
    line: {
      width: '100%',
      height: 1,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.TEXT_SECONDARY,
      borderRadius: 1,
      marginVertical: offset,
      marginTop: offsetTop,
      marginBottom: offsetBottom,
    },
  });

export default PointerLine;
