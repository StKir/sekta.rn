import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';

import { TableCellProps, TableRowProps, TableHeaderProps, TimePeriod } from './TimeTable.types';

// Компонент ячейки таблицы
const TableCell: React.FC<TableCellProps> = ({ day, timePeriod, onPress }) => (
  <TouchableOpacity style={[styles.cell, styles.dataCell]} onPress={() => onPress(day, timePeriod)}>
    {/* Здесь можно добавить контент ячейки */}
  </TouchableOpacity>
);

// Компонент строки таблицы
const TableRow: React.FC<TableRowProps> = ({ timePeriod, weekDays, onCellPress }) => (
  <View style={[styles.row, { width: 50 }]}>
    <View style={[styles.cell, styles.timeCell]}>
      {/* <Text style={styles.timeText}>{timePeriod.name}</Text> */}
      <Text style={styles.hoursText}>{timePeriod.hours}</Text>
    </View>

    {weekDays.map((day, dayIndex) => (
      <TableCell
        day={day}
        key={`cell-${timePeriod.id}-${dayIndex}`}
        timePeriod={timePeriod}
        onPress={onCellPress}
      />
    ))}
  </View>
);

// Компонент заголовка таблицы
const TableHeader: React.FC<TableHeaderProps> = ({ weekDays }) => (
  <View style={styles.row}>
    <View style={[styles.cell, styles.cornerCell]}></View>
    {weekDays.map((day, index) => (
      <View key={`day-${index}`} style={[styles.cell, styles.headerCell]}>
        <Text style={styles.headerText}>{formatDayHeader(day)}</Text>
      </View>
    ))}
  </View>
);

// Форматирование даты для заголовка
const formatDayHeader = (date: Date): string => {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const dayName = days[date.getDay() - 1] || days[6]; // Для воскресенья
  return `${dayName}\n${date.getDate()}`;
};

// Получение массива дней недели с датами
const getWeekDays = (date: Date): Date[] => {
  const days: Date[] = [];
  const dayOfWeek = date.getDay();
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }

  return days;
};

// Основной компонент таблицы
const TimeTable: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const timePeriods: TimePeriod[] = [
    { id: 1, name: 'Утро', hours: '05:00 - 12:00' },
    { id: 2, name: 'День', hours: '12:00 - 17:00' },
    { id: 3, name: 'Вечер', hours: '18:00 - 22:00' },
    { id: 4, name: 'Ночь', hours: '22:00 - 05:00' },
  ];

  const weekDays = getWeekDays(currentDate);

  const changeWeek = (weeks: number): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + weeks * 7);
    setCurrentDate(newDate);
  };

  const handleCellPress = (day: Date, timePeriod: TimePeriod): void => {
    console.log(`Выбрано: ${day.toLocaleDateString()} - ${timePeriod.name}`);
  };

  return (
    <View style={styles.container}>
      {/* Кнопки переключения недель */}
      <View style={styles.weekNavigation}>
        <TouchableOpacity style={styles.navButton} onPress={() => changeWeek(-1)}>
          <Text style={styles.navButtonText}>← Пред</Text>
        </TouchableOpacity>

        <Text style={styles.weekTitle}>
          Неделя {weekDays[0].getDate()}-{weekDays[6].getDate()}{' '}
          {weekDays[0].toLocaleString('default', { month: 'long' })}
        </Text>

        <TouchableOpacity style={styles.navButton} onPress={() => changeWeek(1)}>
          <Text style={styles.navButtonText}>След →</Text>
        </TouchableOpacity>
      </View>

      {/* Таблица */}
      <ScrollView horizontal>
        <View style={styles.table}>
          <TableHeader weekDays={weekDays} />

          <View style={{ height: '100%' }}>
            {timePeriods.map((period) => (
              <TableRow
                key={`period-${period.id}`}
                timePeriod={period}
                weekDays={weekDays}
                onCellPress={handleCellPress}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Стили остаются без изменений
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  navButtonText: {
    fontWeight: 'bold',
  },
  weekTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 100,
    height: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  cornerCell: {
    backgroundColor: '#f9f9f9',
  },
  headerCell: {
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeCell: {
    backgroundColor: '#f5f5f5',
    width: 50,
  },
  timeText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hoursText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  dataCell: {
    backgroundColor: '#fff',
  },
});

export default TimeTable;
