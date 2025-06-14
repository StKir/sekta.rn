import { StyleSheet } from 'react-native';

import { SPACING, SIZES } from '../../../shared/constants';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: SPACING.LARGE,
    },
    title: {
      fontSize: SIZES.FONT_SIZE.LARGE + 8,
      fontWeight: 'bold',
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.SMALL,
    },
    subtitle: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      color: colors.TEXT_SECONDARY,
      marginBottom: SPACING.XLARGE,
    },
    form: {
      width: '100%',
      maxWidth: 300,
      flex: 1,
    },
    avatarScrollContainer: {
      flex: 1,
      maxHeight: 400,
    },
    avatarContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: SPACING.MEDIUM,
    },
    avatarOption: {
      width: '30%',
    },
    avatarOptionSelected: {
      borderColor: colors.PRIMARY,
      backgroundColor: colors.PRIMARY_ALPHA,
    },
    avatarEmoji: {
      fontSize: 30,
      marginBottom: SPACING.SMALL / 2,
    },
    avatarName: {
      fontSize: SIZES.FONT_SIZE.SMALL - 2,
      color: colors.TEXT_PRIMARY,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: SPACING.MEDIUM,
    },
  });
