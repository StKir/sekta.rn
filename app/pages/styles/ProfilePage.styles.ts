import { StyleSheet } from 'react-native';

import { darkColors, lightColors } from '@/shared/theme/colors';
import { SIZES, SPACING } from '@/shared/constants';

type ColorsType = typeof lightColors | typeof darkColors;

export const createStyles = (colors: ColorsType) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      height: '100%',
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    container: {
      paddingTop: SPACING.XLARGE,
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderRadius: 20,
    },
    title: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      fontWeight: 'bold',
      margin: SPACING.MEDIUM,
      color: colors.TEXT_PRIMARY,
    },
  });
