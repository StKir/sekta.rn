import { View, StyleSheet } from 'react-native';
import React from 'react';

import Text from '@/shared/ui/Text';
import { SPACING } from '@/shared/constants';

const Statistic = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title} variant='h2'>
        Статистика
      </Text>
      <Text style={styles.text}>Здесь будет ваша статистика</Text>
      <Text style={styles.text}>• Общее количество записей</Text>
      <Text style={styles.text}>• Статистика настроения</Text>
      <Text style={styles.text}>• Графики активности</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.LARGE,
  },
  title: {
    marginBottom: SPACING.LARGE,
  },
  text: {
    marginBottom: SPACING.MEDIUM,
  },
});

export default Statistic;
