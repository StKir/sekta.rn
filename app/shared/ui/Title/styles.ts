import { StyleSheet, TextStyle } from 'react-native';

import { SIZES, SPACING } from '@/shared/constants';

export const createStyles = (colors: ThemeColors, styles?: TextStyle) =>
  StyleSheet.create({
    title: {
      fontSize: SIZES.FONT_SIZE.XLARGE,
      fontWeight: SIZES.FONT_WEIGHT.MEDIUM,
      color: colors.TEXT_PRIMARY,
      textAlign: 'left',
      marginVertical: SPACING.SMALL,
      ...styles,
    },
  });
