import { StyleSheet } from 'react-native';

import { SPACING, SIZES } from '../../../shared/constants';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: SPACING.LARGE,
    },
    datePickerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      width: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
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
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: SPACING.XLARGE,
      textAlign: 'center',
    },
    form: {
      width: '100%',
      maxWidth: 300,
    },
    inputContainer: {
      marginBottom: SPACING.LARGE,
      marginTop: SPACING.MEDIUM,
    },
    label: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      color: 'white',
      marginBottom: SPACING.SMALL,
      fontWeight: '600',
      textShadowColor: 'rgba(0, 0, 0, 0.6)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    dateButton: {
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: SPACING.MEDIUM,
    },
    dateButtonText: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      color: colors.TEXT_PRIMARY,
    },
    errorText: {
      color: '#FF6B6B',
      fontSize: SIZES.FONT_SIZE.SMALL - 2,
      marginTop: SPACING.SMALL / 2,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    sexContainer: {
      flexDirection: 'row',
      gap: SPACING.MEDIUM,
      justifyContent: 'space-between',
    },
    sexOption: {
      flex: 1,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: SPACING.LARGE,
      gap: SPACING.MEDIUM,
    },
  });
