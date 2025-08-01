import { View, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useRef } from 'react';

import Text from '@/shared/ui/Text';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';

type DayData = {
  date: string;
  day: number;
  hasPost: boolean;
};

type DayStreakProps = {
  days: DayData[];
  longestStreak: number;
};

const DayStreak = ({ days, longestStreak }: DayStreakProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Скроллим к концу списка (текущий день) с небольшой задержкой
    const timer = setTimeout(() => {
      if (flatListRef.current && days.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [days.length]);

  const renderDayItem = ({ item, index }: { item: DayData; index: number }) => (
    <View style={styles.dayItemContainer}>
      {index < days.length - 1 && (
        <View style={[styles.connector, { backgroundColor: colors.PRIMARY }]} />
      )}

      <View
        style={[
          styles.dayCircle,
          {
            backgroundColor: item.hasPost ? colors.PRIMARY : 'transparent',
            borderColor: colors.PRIMARY,
          },
        ]}
      >
        <Text
          style={[
            styles.dayText,
            { color: item.hasPost ? colors.BACKGROUND_PRIMARY : colors.PRIMARY },
          ]}
          variant='body2'
        >
          {item.day}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant='h3'>
        Дней подряд
      </Text>

      <View style={styles.streakContainer}>
        <FlatList
          horizontal
          inverted
          contentContainerStyle={styles.flatListContent}
          data={days}
          keyExtractor={(item) => item.date}
          ref={flatListRef}
          renderItem={renderDayItem}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsLabel} variant='body2'>
          Самая длинная серия:
        </Text>
        <Text style={styles.statsValue} variant='h2'>
          {longestStreak}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.PRIMARY_LITE,
      borderRadius: 25,
      padding: SPACING.LARGE,
      marginBottom: SPACING.LARGE,
    },
    title: {
      marginBottom: SPACING.MEDIUM,
      color: colors.TEXT_PRIMARY,
    },
    streakContainer: {
      marginBottom: SPACING.MEDIUM,
    },
    flatListContent: {
      paddingHorizontal: SPACING.SMALL,
      alignItems: 'center',
    },
    dayItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dayCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dayText: {
      fontSize: 14,
      fontWeight: '600',
    },
    connector: {
      width: 20,
      height: 2,
      marginHorizontal: 4,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SPACING.SMALL,
    },
    statsLabel: {
      color: colors.TEXT_SECONDARY,
    },
    statsValue: {
      color: colors.PRIMARY,
      fontWeight: '700',
    },
  });

export default DayStreak;
