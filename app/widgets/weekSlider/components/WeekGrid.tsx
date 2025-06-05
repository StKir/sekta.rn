import { View } from 'react-native';
import React from 'react';

import { getLayoutPositions } from '../lib/layoutGenerator';
import { styles } from '../WeekSlider.styled';

import type { WeekData } from '../WeekSlider.types';

import { DayCell } from './DayCell';

type WeekGridProps = {
  week: WeekData;
};

export const WeekGrid = ({ week }: WeekGridProps) => {
  const layoutPositions = getLayoutPositions(week.layoutType);

  return (
    <View style={styles.weekContainer}>
      <View style={styles.daysGrid}>
        {week.days.map((day, index) => (
          <DayCell
            day={day}
            dayIndex={index}
            key={`${day.date.getTime()}-${index}`}
            position={layoutPositions[index]}
          />
        ))}
      </View>
    </View>
  );
};
