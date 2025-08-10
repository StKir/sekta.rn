import { StyleSheet } from 'react-native';

import { ThemeColors } from '@/shared/theme/types';
import { SPACING } from '@/shared/constants';

export const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      backgroundColor: colors.BACKGROUND_PRIMARY,
      opacity: 1,
      position: 'absolute',
      top: 0,
      height: '100%',
      left: 0,
      right: 0,
      bottom: 0,
    },
    content: {
      flex: 1,
      padding: SPACING.MEDIUM,
    },
  });
