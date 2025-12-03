import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';

import Text from '@/shared/ui/Text';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';

type PeriodOption = {
  id: string;
  label: string;
  days: number;
};

type StatsPeriodFilterProps = {
  selectedPeriod: number;
  onPeriodChange: (days: number) => void;
};

const StatsPeriodFilter = ({ selectedPeriod, onPeriodChange }: StatsPeriodFilterProps) => {
  const { colors } = useTheme();
  const styles = createStyles();

  const getCurrentDay = () => {
    return new Date().getDate();
  };

  const periods: PeriodOption[] = [
    { id: '3', label: '3 дня', days: 3 },
    { id: '7', label: '7 дней', days: 7 },
    { id: '10', label: '10 дней', days: 10 },
    { id: 'current', label: `${getCurrentDay()} дней`, days: getCurrentDay() },
  ];

  const renderPeriodButton = ({ item }: { item: PeriodOption }) => {
    const isSelected = selectedPeriod === item.days;

    return (
      <TouchableOpacity
        style={[
          styles.periodButton,
          {
            backgroundColor: isSelected ? colors.PRIMARY : 'transparent',
            borderColor: colors.PRIMARY,
          },
        ]}
        onPress={() => onPeriodChange(item.days)}
      >
        <Text
          style={[
            styles.periodText,
            { color: isSelected ? colors.BACKGROUND_PRIMARY : colors.PRIMARY },
          ]}
          variant='body2'
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        contentContainerStyle={styles.flatListContent}
        data={periods}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.id}
        renderItem={renderPeriodButton}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    container: {
      marginBottom: SPACING.MEDIUM,
    },
    flatListContent: {
      paddingHorizontal: SPACING.SMALL,
    },
    periodButton: {
      paddingHorizontal: SPACING.MEDIUM,
      paddingVertical: SPACING.SMALL,
      borderRadius: 20,
      borderWidth: 1.5,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 70,
    },
    periodText: {
      fontSize: 14,
      fontWeight: '600',
    },
    separator: {
      width: SPACING.SMALL,
    },
  });

export default StatsPeriodFilter;
