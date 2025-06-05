import { View } from 'react-native';
import React, { useEffect, useRef } from 'react';

import { styles } from '../WeekSlider.styled';

import type { MasonryLayoutProps, CardPositionMap } from '../WeekSlider.types';

import { DayCard } from './DayCard';

export const MasonryLayout = ({ columns, onDayPress, onPositionsUpdate }: MasonryLayoutProps) => {
  const positionsRef = useRef<CardPositionMap>(new Map());

  useEffect(() => {
    const positions = new Map<string, number>();
    const currentColumnHeights = columns.map(() => 0);

    columns.forEach((column, columnIndex) => {
      let currentHeight = currentColumnHeights[columnIndex];

      column.cards.forEach((day) => {
        const dateKey = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`;
        positions.set(dateKey, currentHeight);
        currentHeight += day.height + 10;
      });

      currentColumnHeights[columnIndex] = currentHeight;
    });

    positionsRef.current = positions;
    onPositionsUpdate?.(positions);
  }, [columns, onPositionsUpdate]);

  return (
    <View style={styles.masonryContainer}>
      {[...columns].reverse().map((column, columnIndex) => (
        <View key={`column-${columnIndex}`} style={styles.column}>
          {column.cards.map((day, cardIndex) => (
            <DayCard day={day} key={`${day.date.getTime()}-${cardIndex}`} onPress={onDayPress} />
          ))}
        </View>
      ))}
    </View>
  );
};
