import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

import { styles } from '../WeekSlider.styled';

import type { DayCardData } from '../WeekSlider.types';

type DayCardProps = {
  day: DayCardData;
  onPress?: (date: Date) => void;
};

export const DayCard = ({ day, onPress }: DayCardProps) => {
  const cardStyle = [
    styles.dayCard,
    day.isToday && styles.dayCardToday,
    !day.isCurrentMonth && styles.dayCardOtherMonth,
    { height: day.height },
  ];

  const dayNumberStyle = [
    styles.dayNumber,
    day.isToday && styles.dayNumberToday,
    !day.isCurrentMonth && styles.dayNumberOtherMonth,
  ];

  const handlePress = () => {
    onPress?.(day.date);
  };

  return (
    <TouchableOpacity activeOpacity={0.8} style={cardStyle} onPress={handlePress}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.dayName}>{day.dayName}</Text>
          <Text style={dayNumberStyle}>{day.dayNumber}</Text>
        </View>
        <Text style={styles.monthName}>{day.monthName}</Text>
      </View>
    </TouchableOpacity>
  );
};
