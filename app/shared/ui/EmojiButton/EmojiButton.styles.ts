import { StyleSheet } from 'react-native';

import { SPACING, SIZES } from '../../constants';

export const createEmojiButtonStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      aspectRatio: 1,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: SPACING.SMALL,
    },
    containerSelected: {
      borderColor: colors.PRIMARY,
      backgroundColor: 'rgba(255, 165, 0, 0.2)',
    },
    emoji: {
      fontSize: 30,
      marginBottom: SPACING.SMALL / 2,
    },
    label: {
      fontSize: SIZES.FONT_SIZE.SMALL,
      color: 'white',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
  });
