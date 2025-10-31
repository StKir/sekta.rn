import { View, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';

import Title from '@/shared/ui/Title/Title';
import Text from '@/shared/ui/Text/Text';
import Input from '@/shared/ui/Input/Input';
import Button from '@/shared/ui/Button/Button';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useSubscription } from '@/shared/hooks/useSubscription';
import { useUserStore } from '@/entities/user';

interface SimpleRegistrationBottomSheetProps {
  onComplete: (userData: any) => void;
  onClose: () => void;
}

const SimpleRegistrationBottomSheet: React.FC<SimpleRegistrationBottomSheetProps> = ({
  onComplete,
  onClose,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { register, isLoading } = useSubscription();
  const { userData } = useUserStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен содержать минимум 6 символов');
      return;
    }

    // Берем данные из store (они уже были собраны в процессе онбординга)
    const registrationData = {
      email: formData.email,
      password: formData.password,
      name: userData?.name || 'Пользователь',
      birthDate: userData?.birthDate || new Date().toISOString(),
      gender: userData?.gender?.name || userData?.gender || 'Не указан',
    };

    const success = await register(registrationData);

    if (success) {
      onComplete(formData);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Регистрация</Title>
        <Text style={styles.subtitle}>Создайте аккаунт для активации подписки</Text>
      </View>

      <View style={styles.form}>
        <Input
          autoCapitalize='none'
          autoComplete='email'
          keyboardType='email-address'
          label='Email'
          placeholder='example@email.com'
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />

        <Input
          secureTextEntry
          autoComplete='new-password'
          label='Пароль'
          placeholder='Минимум 6 символов'
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
        />
      </View>

      <View style={styles.footer}>
        <Button fullWidth loading={isLoading} title='Зарегистрироваться' onPress={handleSubmit} />

        <Button
          style={styles.cancelButton}
          textStyle={styles.cancelButtonText}
          title='Отмена'
          variant='text'
          onPress={onClose}
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
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 200,
    },
    header: {
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      textAlign: 'center',
      color: colors.TEXT_SECONDARY,
      fontSize: 14,
    },
    form: {
      gap: 16,
      marginBottom: 30,
    },
    footer: {
      gap: 12,
    },
    cancelButton: {
      marginTop: 8,
    },
    cancelButtonText: {
      color: colors.TEXT_SECONDARY,
    },
  });

export default SimpleRegistrationBottomSheet;
