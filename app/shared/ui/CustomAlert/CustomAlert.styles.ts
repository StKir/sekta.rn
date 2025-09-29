import { StyleSheet } from 'react-native';

import { ThemeColors } from '@/shared/theme/types';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    alertContainer: {
      backgroundColor: colors.BACKGROUND_SECONDARY,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 20,
      maxWidth: 320,
      width: '100%',
      shadowColor: colors.SHADOW,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    successContainer: {
      borderLeftWidth: 4,
      borderLeftColor: colors.SUCCESS,
    },
    errorContainer: {
      borderLeftWidth: 4,
      borderLeftColor: colors.DANGER,
    },
    warningContainer: {
      borderLeftWidth: 4,
      borderLeftColor: colors.WARNING,
    },
    infoContainer: {
      borderLeftWidth: 4,
      borderLeftColor: colors.INFO,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    iconContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    successIcon: {
      backgroundColor: colors.SUCCESS_ALPHA,
    },
    errorIcon: {
      backgroundColor: colors.DANGER_ALPHA,
    },
    warningIcon: {
      backgroundColor: colors.WARNING,
    },
    infoIcon: {
      backgroundColor: colors.PRIMARY_ALPHA,
    },
    title: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
      flex: 1,
    },
    message: {
      fontSize: 15,
      color: colors.TEXT_SECONDARY,
      lineHeight: 20,
      marginBottom: 20,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      minWidth: 80,
      alignItems: 'center',
    },
    defaultButton: {
      backgroundColor: colors.PRIMARY,
    },
    cancelButton: {
      backgroundColor: colors.GRAY_5,
    },
    destructiveButton: {
      backgroundColor: colors.DANGER,
    },
    buttonText: {
      fontSize: 15,
      fontWeight: '600',
    },
    defaultButtonText: {
      color: colors.BUTTON_TEXT,
    },
    cancelButtonText: {
      color: colors.TEXT_PRIMARY,
    },
    destructiveButtonText: {
      color: colors.BUTTON_TEXT,
    },
    flex1: {
      flex: 1,
    },
    iconText: {
      color: colors.BACKGROUND_SECONDARY,
      fontWeight: 'bold',
    },
  });
