import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';

import PageContainer from '@/shared/ui/Container/PageContainer';
import { DateInput } from '@/shared/ui';

const DateInputTestPage = () => {
  const [dateValue, setDateValue] = useState<Date | undefined>();
  const [timeValue, setTimeValue] = useState<Date | undefined>();
  const styles = createStyles();

  return (
    <PageContainer>
      <View style={styles.container}>
        <DateInput label='Выберите дату' type='date' value={dateValue} onChange={setDateValue} />

        <View style={styles.spacer} />

        <DateInput label='Выберите время' type='time' value={timeValue} onChange={setTimeValue} />
      </View>
    </PageContainer>
  );
};

const createStyles = () =>
  StyleSheet.create({
    container: {
      padding: 20,
    },
    spacer: {
      height: 20,
    },
  });

export default DateInputTestPage;
