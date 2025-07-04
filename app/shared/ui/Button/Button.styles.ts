import { StyleSheet } from 'react-native';

import { SPACING, SIZES } from '../../constants';

export const createButtonStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    button: {
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
      minWidth: 100,
      overflow: 'hidden',
    },

    paddingZero: {
      paddingHorizontal: 0,
      paddingVertical: 0,
    },

    // Variant styles
    primaryButton: {
      backgroundColor: colors.PRIMARY,
    },
    secondaryButton: {
      backgroundColor: colors.GRAY_4,
    },
    outlineButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.PRIMARY,
    },
    gradientButton: {
      backgroundColor: 'transparent',

      padding: 0,
    },

    // Size styles
    smallButton: {
      paddingVertical: SPACING.SMALL,
      paddingHorizontal: SPACING.MEDIUM,
    },
    mediumButton: {
      paddingVertical: SPACING.MEDIUM,
      paddingHorizontal: SPACING.XLARGE,
    },
    largeButton: {
      paddingVertical: SPACING.LARGE,
      paddingHorizontal: SPACING.XLARGE,
    },

    // Full width style
    fullWidthButton: {
      alignSelf: 'stretch',
      width: '100%',
    },

    // Disabled style
    disabledButton: {
      backgroundColor: colors.GRAY_3,
      opacity: 0.5,
    },

    // Gradient background
    gradientBackground: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'red',
      paddingVertical: SPACING.MEDIUM,
      paddingHorizontal: SPACING.XLARGE,
      borderRadius: 22,
    },

    // Text styles
    buttonText: {
      fontWeight: '600',
      textAlign: 'center',
    },

    // Variant text styles
    primaryButtonText: {
      color: 'white',
    },
    secondaryButtonText: {
      color: colors.TEXT_PRIMARY,
    },
    outlineButtonText: {
      color: colors.PRIMARY,
    },
    gradientButtonText: {
      color: 'white',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },

    // Size text styles
    smallButtonText: {
      fontSize: SIZES.FONT_SIZE.SMALL,
    },
    mediumButtonText: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
    },
    largeButtonText: {
      fontSize: SIZES.FONT_SIZE.LARGE,
    },
  });
