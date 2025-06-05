import { StyleSheet, Dimensions } from 'react-native';

import { ThemeColors } from '../../shared/theme/types';
import { SIZES, SPACING } from '../../shared/constants';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_SECONDARY,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingTop: SPACING.LARGE,
      paddingBottom: SIZES.TAB_BAR_HEIGHT + SPACING.LARGE,
    },
    card: {
      backgroundColor: colors.GRAY_6,
      borderRadius: 12,
      height: SIZES.CARD_HEIGHT,
      width: SCREEN_WIDTH * 0.9,
      shadowColor: colors.SHADOW,
      shadowOpacity: 0.3,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      elevation: 5,
      overflow: 'hidden',
    },
    text_container: {
      width: '100%',
      padding: SPACING.LARGE,
      position: 'absolute',
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      zIndex: 20,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
      resizeMode: 'cover',
    },
    title: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: SPACING.SMALL,
    },
    type: {
      fontSize: SIZES.FONT_SIZE.SMALL,
      color: 'rgba(255,255,255,0.8)',
      marginBottom: SPACING.SMALL,
      textTransform: 'uppercase',
    },
    description: {
      fontSize: SIZES.FONT_SIZE.SMALL,
      color: 'rgba(255,255,255,0.9)',
      marginTop: SPACING.SMALL,
    },
    button: {
      backgroundColor: colors.PRIMARY,
      paddingVertical: SPACING.MEDIUM,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: SPACING.MEDIUM,
    },
    buttonText: {
      color: colors.BACKGROUND_PRIMARY,
      fontWeight: '600',
    },
    animatedCard: {
      position: 'absolute',
      width: SCREEN_WIDTH * 0.9,
      height: SIZES.CARD_HEIGHT,
      backgroundColor: colors.GRAY_6,
      borderRadius: 12,
      zIndex: -1,
      shadowColor: colors.SHADOW,
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      elevation: 3,
    },
    swipeOverlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: 12,
      zIndex: 10,
    },
  });
