import { View, Text, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';

import { WeekSlider } from '../widgets/weekSlider';
import ContainerRadial from '../shared/ui/ContainerRadial/ContainerRadial';
import { lightColors } from '../shared/theme/colors';

const WeekSliderDemo = () => {
  const [currentMonth, setCurrentMonth] = useState<string>('');

  const handleDateChange = useCallback((date: Date) => {
    console.log('Selected date:', date.toDateString());
  }, []);

  const handleCurrentMonthChange = useCallback((monthName: string) => {
    setCurrentMonth(monthName);
  }, []);

  return (
    <ContainerRadial>
      <View style={styles.container}>
        <Text style={styles.title}>{currentMonth || 'Календарь'}</Text>
        <WeekSlider
          initialDate={new Date()}
          onCurrentMonthChange={handleCurrentMonthChange}
          onDateChange={handleDateChange}
        />
      </View>
    </ContainerRadial>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.BACKGROUND_SECONDARY,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: lightColors.TEXT_PRIMARY,
  },
});

export default WeekSliderDemo;
