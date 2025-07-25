import { StyleSheet } from 'react-native';

import { ThemeColors } from '@/shared/theme/types';
import { SPACING } from '@/shared/constants';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: 16,
    },
    mediaList: {
      flexDirection: 'row',
      paddingVertical: 10,
    },
    mediaItem: {
      position: 'relative',
      marginRight: 12,
    },
    mediaPreview: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: colors.BACKGROUND_SECONDARY,
    },
    videoPreview: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.TEXT_SECONDARY,
    },
    removeButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#FF3B30',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: SPACING.SMALL,
    },
    actionButton: {
      flexDirection: 'row',
      paddingVertical: 10,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.TEXT_SECONDARY,
      backgroundColor: colors.BACKGROUND_SECONDARY,
      gap: SPACING.SMALL,
    },
  });
