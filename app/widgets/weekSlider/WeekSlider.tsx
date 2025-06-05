import { View, ScrollView, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';

import { lightColors } from '../../shared/theme/colors';

import type { WeekSliderProps, DayCardData, PaginationState, CardPositionMap } from './WeekSlider.types';

import { generateDaysData, generateNextDaysData, createMasonryLayout } from './lib/dataGenerator';
import { CALENDAR_CONSTANTS, MONTH_NAMES } from './constants';
import { MasonryLayout } from './components/MasonryLayout';
import { styles } from './WeekSlider.styled';

const WeekSlider = ({ initialDate, onDateChange, onCurrentMonthChange }: WeekSliderProps) => {
  const [allDays, setAllDays] = useState<DayCardData[]>(() => generateDaysData(initialDate));
  const [pagination, setPagination] = useState<PaginationState>({
    isLoading: false,
    hasMore: true,
    lastDate: (() => {
      const days = generateDaysData(initialDate);
      return days[days.length - 1].date;
    })(),
  });
  const [showTodayButton, setShowTodayButton] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const currentMonthRef = useRef<string>('');
  const todayRef = useRef<Date>(new Date());
  const cardPositionsRef = useRef<CardPositionMap>(new Map());

  const masonryColumns = useMemo(() => createMasonryLayout(allDays), [allDays]);

  const getTodayDateKey = useCallback(() => {
    const today = todayRef.current;
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  }, []);

  const getTodayPosition = useCallback(() => {
    const todayKey = getTodayDateKey();
    return cardPositionsRef.current.get(todayKey) || 0;
  }, [getTodayDateKey]);

  const handlePositionsUpdate = useCallback((positions: CardPositionMap) => {
    cardPositionsRef.current = positions;
  }, []);

  const handleDayPress = useCallback(
    (date: Date) => {
      onDateChange?.(date);
    },
    [onDateChange]
  );

  const loadMoreDays = useCallback(async () => {
    if (pagination.isLoading || !pagination.hasMore) {
      return;
    }

    setPagination((prev) => ({ ...prev, isLoading: true }));

    setTimeout(() => {
      const newDays = generateNextDaysData(pagination.lastDate);
      setAllDays((prev) => [...prev, ...newDays]);
      setPagination({
        isLoading: false,
        hasMore: true,
        lastDate: newDays[newDays.length - 1].date,
      });
    }, 300);
  }, [pagination.isLoading, pagination.hasMore, pagination.lastDate]);

  const findCurrentMonth = useCallback(
    (scrollY: number) => {
      const estimatedIndex = Math.floor(scrollY / 150) * CALENDAR_CONSTANTS.COLUMNS_COUNT;
      const dayIndex = Math.min(estimatedIndex, allDays.length - 1);
      
      if (dayIndex >= 0 && allDays[dayIndex]) {
        const currentMonth = MONTH_NAMES[allDays[dayIndex].date.getMonth()];
        if (currentMonth !== currentMonthRef.current) {
          currentMonthRef.current = currentMonth;
          onCurrentMonthChange?.(currentMonth);
        }
      }
    },
    [allDays, onCurrentMonthChange]
  );

  const checkTodayVisibility = useCallback(
    (scrollY: number) => {
      if (!isInitialized) {
        setShowTodayButton(false);
        return;
      }

      const todayPosition = getTodayPosition();
      const isAwayFromToday = Math.abs(scrollY - todayPosition) > CALENDAR_CONSTANTS.TODAY_BUTTON_THRESHOLD;
      
      setShowTodayButton(isAwayFromToday);
    },
    [isInitialized, getTodayPosition]
  );

  const scrollToToday = useCallback(() => {
    const todayPosition = getTodayPosition();
    scrollViewRef.current?.scrollTo({ y: todayPosition, animated: true });
  }, [getTodayPosition]);

  const handleScroll = useCallback(
    (event: any) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const scrollY = contentOffset.y;
      
      findCurrentMonth(scrollY);
      checkTodayVisibility(scrollY);

      const distanceFromEnd = contentSize.height - layoutMeasurement.height - scrollY;
      if (distanceFromEnd < CALENDAR_CONSTANTS.PAGINATION_THRESHOLD) {
        loadMoreDays();
      }
    },
    [findCurrentMonth, checkTodayVisibility, loadMoreDays]
  );

  useEffect(() => {
    if (allDays.length > 0 && cardPositionsRef.current.size > 0 && !isInitialized) {
      setTimeout(() => {
        const todayPosition = getTodayPosition();
        scrollViewRef.current?.scrollTo({ y: todayPosition, animated: false });
        setIsInitialized(true);
        
        findCurrentMonth(todayPosition);
      }, 150);
    }
  }, [allDays, isInitialized, getTodayPosition, findCurrentMonth]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior='automatic'
        ref={scrollViewRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        onScroll={handleScroll}
      >
        <MasonryLayout 
          columns={masonryColumns} 
          onDayPress={handleDayPress}
          onPositionsUpdate={handlePositionsUpdate}
        />
        {pagination.isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={lightColors.PRIMARY} size='large' />
          </View>
        )}
      </ScrollView>
      
      {showTodayButton && (
        <TouchableOpacity style={styles.todayButton} onPress={scrollToToday}>
          <Text style={styles.todayButtonText}>Сегодня</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default WeekSlider;
