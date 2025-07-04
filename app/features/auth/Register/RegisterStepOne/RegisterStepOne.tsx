import { View, StyleSheet } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import React from 'react';

import { RegisterFormData } from '@/pages/RegisterPage';

import { RegistrationStepProps } from '../../types';

import Input from '@/shared/ui/Input';
import { Button } from '@/shared/ui';
import { useTheme } from '@/shared/theme';
import GenderSelector from '@/shared/components/GenderSelector';

const RegisterStepOne = ({ onNext }: RegistrationStepProps) => {
  const { control, watch } = useFormContext<RegisterFormData>();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const watchedValues = watch(['name', 'age', 'sex']);
  const [name, age, sex] = watchedValues;

  const isFormValid =
    name &&
    name.length >= 2 &&
    age &&
    !isNaN(Number(age)) &&
    Number(age) >= 5 &&
    Number(age) <= 120 &&
    sex !== null;

  const handleNext = () => {
    if (isFormValid) {
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Controller
          control={control}
          name='name'
          render={({ field: { onChange, value } }) => (
            <Input
              label='Как тебя зовут?'
              placeholder='Имя'
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name='age'
          render={({ field: { onChange, value } }) => (
            <Input
              keyboardType='numeric'
              label='Сколько тебе лет?'
              placeholder='Возраст'
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name='sex'
          render={({ field: { onChange, value } }) => (
            <GenderSelector label='Твой пол' value={value} onChange={onChange} />
          )}
        />

        <Button fullWidth disabled={!isFormValid} title={'Далее'} onPress={handleNext} />
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      borderRadius: 20,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    content: {
      flex: 1,
      gap: 20,
    },
  });

export default RegisterStepOne;
