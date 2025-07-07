import { View } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import React from 'react';

import { RegistrationStepProps } from '../../types';

import { createStyles } from './RegisterStepTwo.styles';

import Selector from '@/shared/ui/Selector';
import FormWrapper from '@/shared/ui/FormWrapper/FormStepWrapper';
import { Button } from '@/shared/ui';
import { FormAnswers } from '@/shared/types/form.types';
import { useTheme } from '@/shared/theme';

const RegisterStepTwo = ({ onNext }: RegistrationStepProps) => {
  const { control, watch } = useFormContext<FormAnswers>();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const watchedValues = watch(['feeling', 'stress', 'habits', 'tracking']);
  const [feeling, stress, habits, tracking] = watchedValues;

  const isFormValid =
    feeling !== null && stress !== null && habits !== null && tracking && tracking.length > 0;

  const handleNext = () => {
    if (isFormValid) {
      onNext();
    }
  };

  return (
    <FormWrapper subtitle='Детали о тебе'>
      <View style={styles.section}>
        <Controller
          control={control}
          name='feeling'
          render={({ field: { onChange, value } }) => (
            <Selector
              label='Как ты в целом чувствуешь себя в последнее время?'
              options={[
                { value: 'normal', label: 'Нормально' },
                { value: 'not_good', label: 'Не очень' },
                { value: 'bad', label: 'Тяжело' },
                { value: 'great', label: 'Отлично' },
              ]}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name='stress'
          render={({ field: { onChange, value } }) => (
            <Selector
              label='Есть ли у тебя ощущение тревоги, стресса или усталости в повседневной жизни?'
              options={[
                { value: 'often', label: 'Часто' },
                { value: 'sometimes', label: 'Иногда' },
                { value: 'rarely', label: 'Редко' },
                { value: 'never', label: 'Никогда' },
              ]}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name='habits'
          render={({ field: { onChange, value } }) => (
            <Selector
              label='Имеешь ли ты вредные привычки?'
              options={[
                { value: 'yes', label: 'Да' },
                { value: 'no', label: 'Нет' },
              ]}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name='tracking'
          render={({ field: { onChange, value } }) => (
            <Selector
              label='Что ты хочешь отслеживать или улучшить с нашей помощью?'
              options={[
                { value: 'mood', label: 'Настроение' },
                { value: 'stress', label: 'Уровень стресса' },
                { value: 'energy', label: 'Энергичность' },
                { value: 'sleep', label: 'Сон' },
              ]}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </View>

      <Button fullWidth disabled={!isFormValid} title='Завершить' onPress={handleNext} />
    </FormWrapper>
  );
};

export default RegisterStepTwo;
