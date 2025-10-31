import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';

import Title from '@/shared/ui/Title/Title';
import Text from '@/shared/ui/Text/Text';
import Input from '@/shared/ui/Input/Input';
import Button from '@/shared/ui/Button/Button';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useSubscription } from '@/shared/hooks/useSubscription';

interface RegistrationStepProps {
  onNext: () => void;
  onComplete: (userData: any) => void;
}

const RegistrationStep: React.FC<RegistrationStepProps> = ({ onNext, onComplete }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { register, isLoading } = useSubscription();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    birthDate: '',
    gender: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.name) {
      newErrors.name = 'Имя обязательно';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Дата рождения обязательна';
    }

    if (!formData.gender) {
      newErrors.gender = 'Пол обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const success = await register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      birthDate: formData.birthDate,
      gender: formData.gender,
    });

    if (success) {
      onComplete(formData);
      onNext();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Создание аккаунта</Title>
        <Text style={styles.subtitle}>Заполните данные для создания аккаунта</Text>

        <View style={styles.form}>
          <Input
            autoCapitalize='none'
            error={errors.email}
            keyboardType='email-address'
            label='Email'
            placeholder='example@email.com'
            value={formData.email}
            onChangeText={(value: string) => handleInputChange('email', value)}
          />

          <Input
            secureTextEntry
            error={errors.password}
            label='Пароль'
            placeholder='Минимум 6 символов'
            value={formData.password}
            onChangeText={(value: string) => handleInputChange('password', value)}
          />

          <Input
            secureTextEntry
            error={errors.confirmPassword}
            label='Подтвердите пароль'
            placeholder='Повторите пароль'
            value={formData.confirmPassword}
            onChangeText={(value: string) => handleInputChange('confirmPassword', value)}
          />

          <Input
            error={errors.name}
            label='Имя'
            placeholder='Ваше имя'
            value={formData.name}
            onChangeText={(value: string) => handleInputChange('name', value)}
          />

          <Input
            error={errors.birthDate}
            label='Дата рождения'
            placeholder='YYYY-MM-DD'
            value={formData.birthDate}
            onChangeText={(value: string) => handleInputChange('birthDate', value)}
          />

          <Input
            error={errors.gender}
            label='Пол'
            placeholder='male или female'
            value={formData.gender}
            onChangeText={(value: string) => handleInputChange('gender', value)}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          loading={isLoading}
          style={styles.submitButton}
          title='Создать аккаунт'
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    title: {
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      textAlign: 'center',
      color: colors.TEXT_SECONDARY,
      marginBottom: 30,
    },
    form: {
      gap: 16,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    submitButton: {
      marginTop: 20,
    },
  });

export default RegistrationStep;
