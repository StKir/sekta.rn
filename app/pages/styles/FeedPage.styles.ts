import { StyleSheet } from 'react-native';

import { lightColors } from '@/shared/theme/colors';
import { SIZES, SPACING } from '@/shared/constants';

type ColorsType = typeof lightColors;

export const createStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    title: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      fontWeight: 'bold',
      margin: SPACING.MEDIUM,
      color: colors.TEXT_PRIMARY,
    },
  });
