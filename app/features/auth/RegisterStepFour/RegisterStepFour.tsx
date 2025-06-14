import { StyleSheet, View } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import React from 'react';

import { RegisterFormData } from '@/pages/RegisterPage';

import { RegistrationStepProps } from '../types';

import { colors } from '@/theme/colors';
import { Button } from '@/shared/ui';
import Selector from '@/shared/components/Selector';

const RegisterStepFour = ({ onNext }: RegistrationStepProps) => {
  const { control, watch } = useFormContext<RegisterFormData>();

  const watchedValues = watch(['avatar', 'appUsage', 'communicationStyle']);
  const [avatar, appUsage, communicationStyle] = watchedValues;

  const isFormValid = avatar !== null && appUsage !== null && communicationStyle !== null;

  const handleNext = () => {
    if (isFormValid) {
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Controller
            control={control}
            name='avatar'
            render={({ field: { onChange, value } }) => (
              <Selector
                buttonStyle={styles.avatarButton}
                buttonTextStyle={styles.avatarText}
                label='Выбери аватар'
                options={[
                  { value: '😊', label: '😊' },
                  { value: '😎', label: '😎' },
                  { value: '🤔', label: '🤔' },
                  { value: '😌', label: '😌' },
                  { value: '😇', label: '😇' },
                  { value: '🤓', label: '🤓' },
                  { value: '😉', label: '😉' },
                  { value: '😄', label: '😄' },
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
            name='appUsage'
            render={({ field: { onChange, value } }) => (
              <Selector
                label='Пользовался ли похожими приложениями?'
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
            name='communicationStyle'
            render={({ field: { onChange, value } }) => (
              <Selector
                label='Какой стиль общения тебе больше нравится?'
                options={[
                  { value: 'friendly', label: 'Дружелюбный' },
                  { value: 'calm', label: 'Спокойный' },
                  { value: 'humorous', label: 'С юмором' },
                ]}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </View>

        <Button fullWidth disabled={!isFormValid} title='Зарегистрироваться' onPress={handleNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },

  avatarButton: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  avatarText: {
    fontSize: 52,
    // height: 50,
    lineHeight: 60,
    // paddingVertical: 20,
  },
});

export default RegisterStepFour;
