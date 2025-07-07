import { useFormContext, Controller } from 'react-hook-form';
import React from 'react';

import { RegistrationStepProps } from '../../types';

import Input from '@/shared/ui/Input';
import FormStepWrapper from '@/shared/ui/FormWrapper/FormStepWrapper';
import { Button } from '@/shared/ui';
import { FormAnswers } from '@/shared/types/form.types';
import GenderSelector from '@/shared/components/GenderSelector';

const RegisterStepOne = ({ onNext }: RegistrationStepProps) => {
  const { control, watch } = useFormContext<FormAnswers>();
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
    <FormStepWrapper subtitle='Основная информация'>
      <Controller
        control={control}
        name='name'
        render={({ field: { onChange, value } }) => (
          <Input label='Как тебя зовут?' placeholder='Имя' value={value} onChangeText={onChange} />
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

      <Button fullWidth disabled={!isFormValid} title='Далее' onPress={handleNext} />
    </FormStepWrapper>
  );
};

export default RegisterStepOne;
