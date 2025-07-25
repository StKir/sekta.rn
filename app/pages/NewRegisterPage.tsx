import { Alert } from 'react-native';
import React from 'react';
import registrationData from 'apptests/registration.json';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { StorageService } from '@/shared/utils/storage';
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

  const handleFormComplete = (answers: FormAnswers) => {
    const testResult = formatAnswersToTestResult(formData, answers);
    addResult(testResult);

    StorageService.setUser(answers);

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
