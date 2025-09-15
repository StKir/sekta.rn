import { StyleSheet } from 'react-native';

import { ThemeColors } from '@/shared/theme/types';
import { SPACING } from '@/shared/constants';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: SPACING.MEDIUM,
      backgroundColor: colors.BACKGROUND_SECONDARY,
      padding: SPACING.MEDIUM,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.BORDER,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      color: colors.TEXT_PRIMARY,
      flex: 1,
    },
    timeContainer: {
      gap: SPACING.SMALL,
    },
    timeLabel: {
      color: colors.TEXT_SECONDARY,
    },
    permissionText: {
      color: colors.DANGER,
      textAlign: 'center',
    },
  });
