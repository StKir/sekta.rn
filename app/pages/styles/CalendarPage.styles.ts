import { StyleSheet, Dimensions } from 'react-native';

import { ThemeColors } from '@/shared/theme/types';
import { SIZES, SPACING } from '@/shared/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DAY_HEIGHT = (SCREEN_HEIGHT * 0.8) / 6;

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.LARGE,
      paddingVertical: SPACING.MEDIUM,
      borderBottomWidth: 1,
      borderBottomColor: colors.SEPARATOR,
    },
    monthTitle: {
      fontSize: SIZES.FONT_SIZE.LARGE,
      fontWeight: 'bold',
      color: colors.TEXT_PRIMARY,
    },
    arrowButton: {
      padding: SPACING.MEDIUM,
    },
    arrowText: {
      fontSize: SIZES.FONT_SIZE.LARGE,
      color: colors.PRIMARY,
      fontWeight: 'bold',
    },
    calendarContent: {
      paddingBottom: SIZES.TAB_BAR_HEIGHT,
    },
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: SCREEN_WIDTH,
    },
    dayCell: {
      height: DAY_HEIGHT,
      borderRadius: 8,
      margin: 2,
      backgroundColor: colors.BACKGROUND_SECONDARY,
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
      overflow: 'hidden',
    },
    todayCell: {
      backgroundColor: colors.PRIMARY,
    },
    dayHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.SMALL,
      paddingVertical: SPACING.SMALL,
      backgroundColor: colors.SEPARATOR,
    },
    dayNumber: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      fontWeight: 'bold',
      color: colors.TEXT_PRIMARY,
    },
    dayName: {
      fontSize: SIZES.FONT_SIZE.SMALL,
      color: colors.TEXT_SECONDARY,
    },
    todayText: {
      color: colors.BACKGROUND_PRIMARY,
    },
    dayContent: {
      flex: 1,
      padding: SPACING.SMALL,
    },
  });
