import { Alert } from 'react-native';
import React from 'react';
import registrationData from 'apptests/registration.json';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { StorageService } from '@/shared/utils/storage';
import { MediaMigrationService } from '@/shared/utils/mediaMigration';
import { transformJsonToFormData, formatAnswersToTestResult } from '@/shared/utils/formUtils';
import { FormAnswers } from '@/shared/types/form.types';
import { RootStackParamList } from '@/navigation/types';
import DynamicForm from '@/features/forms/DynamicForm/DynamicForm';
import HelloScreen from '@/features/auth/Register/HelloScreen/HelloScreen';
import { useTestResultsStore } from '@/entities/tests/store/testResultsStore';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const NewRegisterPage = () => {
  const formData = transformJsonToFormData(registrationData);
  const navigation = useNavigation<NavigationProp>();
  const { addResult } = useTestResultsStore();

  const handleFormComplete = async (answers: FormAnswers) => {
    const testResult = formatAnswersToTestResult(formData, answers);
    addResult(testResult);

    // Добавляем дату регистрации
    const userDataWithDate = {
      ...answers,
      registrationDate: new Date().toISOString(),
    };

    console.log('====================================');
    console.log(answers);
    console.log('====================================');

    StorageService.setUser(userDataWithDate);

    // Мигрируем медиа пользователя сразу после сохранения
    try {
      await MediaMigrationService.migrateExistingMedia();
    } catch (error) {
      console.error('Failed to migrate user media:', error);
    }

    Alert.alert('Регистрация завершена!', 'Добро пожаловать в приложение!', [
      {
        text: 'Продолжить',
        onPress: () => {
          navigation.replace('TabNavigator');
        },
      },
    ]);
  };

  return (
    <DynamicForm
      customFirstStep={HelloScreen}
      formData={formData}
      onComplete={handleFormComplete}
    />
  );
};

export default NewRegisterPage;
