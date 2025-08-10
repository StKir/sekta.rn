import { StyleSheet } from 'react-native';

import { ThemeColors } from '@/shared/theme/types';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: 16,
    },
    label: {
      color: colors.TEXT_PRIMARY,
    },
    permissionButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.BACKGROUND_SECONDARY,
      alignItems: 'center',
      justifyContent: 'center',
    },
    permissionButtonActive: {
      backgroundColor: colors.PRIMARY,
    },
    permissionButtonText: {
      color: colors.TEXT_PRIMARY,
      fontWeight: '600',
    },
    permissionButtonTextActive: {
      color: colors.SURFACE,
    },
    timeContainer: {
      gap: 8,
    },
    timeLabel: {
      color: colors.TEXT_PRIMARY,
    },
    permissionText: {
      color: colors.DANGER,
      textAlign: 'center',
    },
  });
