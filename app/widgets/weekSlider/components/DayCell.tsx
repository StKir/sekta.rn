import { View, Text, Dimensions } from 'react-native';
import React from 'react';

import { WEEK_SLIDER_CONSTANTS } from '../constants';
import { styles } from '../WeekSlider.styled';

import type { DayData, CellPosition } from '../WeekSlider.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DayCellProps = {
  day: DayData;
  dayIndex: number;
  position: CellPosition;
};

export const DayCell = ({ day, dayIndex, position }: DayCellProps) => {
  const isWednesday = dayIndex === WEEK_SLIDER_CONSTANTS.WEDNESDAY_INDEX;

  const containerWidth = SCREEN_WIDTH - WEEK_SLIDER_CONSTANTS.SLIDER_MARGIN - 8;
  const cellSize = (containerWidth - 20) / 3;

  const containerStyle = [
    styles.dayContainer,
    isWednesday && styles.dayContainerWednesday,
    day.isToday && styles.dayContainerToday,
    {
      left: position.col * (cellSize + 10),
      top: position.row * (cellSize + 10),
      width: cellSize * position.width + (position.width - 1) * 10,
      height: cellSize * position.height + (position.height - 1) * 10,
    },
  ];

  const textStyle = [
    styles.dayNumber,
    isWednesday && styles.dayNumberWednesday,
    day.isToday && styles.dayNumberToday,
    !day.isCurrentMonth && styles.dayNumberOtherMonth,
  ];

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{day.dayNumber}</Text>
    </View>
  );
};
