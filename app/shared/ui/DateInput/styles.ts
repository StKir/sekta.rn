import { StyleSheet } from 'react-native';

import { DATE_INPUT_CONSTANTS } from './constants';

import { ThemeColors } from '@/shared/theme/types';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    label: {
      marginBottom: DATE_INPUT_CONSTANTS.LABEL_MARGIN_BOTTOM,
    },
    input: {
      height: DATE_INPUT_CONSTANTS.HEIGHT,
      borderWidth: 1,
      borderColor: colors.TEXT_PRIMARY,
      borderRadius: DATE_INPUT_CONSTANTS.BORDER_RADIUS,
      paddingHorizontal: DATE_INPUT_CONSTANTS.PADDING_HORIZONTAL,
      justifyContent: 'center',
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    inputText: {
      color: colors.TEXT_PRIMARY,
    },
    inputError: {
      borderColor: '#FF3B30',
    },
    error: {
      marginTop: DATE_INPUT_CONSTANTS.ERROR_MARGIN_TOP,
      color: '#FF3B30',
    },
  });
