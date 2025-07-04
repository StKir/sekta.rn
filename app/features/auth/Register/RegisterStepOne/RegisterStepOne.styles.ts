import { StyleSheet } from 'react-native';

import { SPACING, SIZES } from '../../../../shared/constants';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      marginTop: SPACING.LARGE,
      paddingHorizontal: SPACING.MEDIUM,
    },
    title: {
      fontSize: SIZES.FONT_SIZE.LARGE + 20,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: SPACING.SMALL,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    subtitle: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      color: colors.TEXT_SECONDARY,
      marginBottom: SPACING.XLARGE,
    },
    form: {
      width: '100%',
      maxWidth: 300,
    },
    inputContainer: {
      marginTop: SPACING.LARGE,
      marginBottom: SPACING.LARGE,
    },
    label: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.SMALL,
      fontWeight: '600',
    },
    input: {
      borderRadius: 12,
      paddingVertical: SPACING.MEDIUM,
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      color: colors.TEXT_PRIMARY,
    },
    inputError: {
      borderColor: colors.DANGER,
    },
    errorText: {
      color: colors.DANGER,
      fontSize: SIZES.FONT_SIZE.SMALL - 2,
      marginTop: SPACING.SMALL / 2,
    },
  });
