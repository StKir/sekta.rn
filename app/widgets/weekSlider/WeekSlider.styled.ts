import { StyleSheet, Dimensions } from 'react-native';

import { lightColors } from '../../shared/theme/colors';

import { CALENDAR_CONSTANTS } from './constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: CALENDAR_CONSTANTS.SLIDER_MARGIN / 2,
    // position: 'relative',
  },

  scrollView: {
    flex: 1,
  },

  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingTop: 20,
  },

  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  todayButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: lightColors.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 1000,
  },

  todayButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  column: {
    width:
      (SCREEN_WIDTH - CALENDAR_CONSTANTS.SLIDER_MARGIN - CALENDAR_CONSTANTS.COLUMN_SPACING) /
      CALENDAR_CONSTANTS.COLUMNS_COUNT,
  },

  dayCard: {
    backgroundColor: lightColors.BACKGROUND_PRIMARY,
    borderRadius: 12,
    padding: 16,
    marginBottom: CALENDAR_CONSTANTS.CARD_SPACING,
    borderWidth: 1,
    borderColor: lightColors.SEPARATOR,
    shadowColor: lightColors.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  dayCardToday: {
    borderColor: lightColors.PRIMARY,
    borderWidth: 2,
    backgroundColor: lightColors.PRIMARY_ALPHA,
  },

  dayCardOtherMonth: {
    backgroundColor: lightColors.GRAY_6,
    borderColor: lightColors.GRAY_4,
  },

  dayNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: lightColors.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },

  dayNumberToday: {
    color: lightColors.PRIMARY,
  },

  dayNumberOtherMonth: {
    color: lightColors.TEXT_TERTIARY,
  },

  dayName: {
    fontSize: 14,
    fontWeight: '600',
    color: lightColors.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 4,
  },

  monthName: {
    fontSize: 12,
    color: lightColors.TEXT_TERTIARY,
    textAlign: 'center',
  },

  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
