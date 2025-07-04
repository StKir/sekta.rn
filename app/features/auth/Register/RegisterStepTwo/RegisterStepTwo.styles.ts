import { StyleSheet } from 'react-native';

import { typography } from '@/shared/theme/typography';
import { ThemeColors } from '@/shared/theme/types';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
      borderRadius: 20,
    },
    content: {
      flex: 1,
      padding: 24,
    },
    section: {
      marginBottom: 32,
    },
    button: {
      backgroundColor: colors.PRIMARY,
      height: 56,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    buttonDisabled: {
      backgroundColor: colors.DANGER_ALPHA,
    },
    buttonText: {
      ...typography.button,
      color: colors.TEXT_PRIMARY,
    },
    buttonTextDisabled: {
      color: colors.TEXT_PRIMARY,
    },
  });
