import { Alert } from 'react-native';
import React from 'react';
import registrationData from 'appData/apptests/registration.json';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { removeAllReminders, setReminders } from '@/shared/utils/reminder';
import { transformJsonToFormData, formatAnswersToTestResult } from '@/shared/utils/formUtils';
import { FormAnswers } from '@/shared/types/form.types';
import { useUser } from '@/shared/hooks/useUser';
import { RootStackParamList } from '@/navigation/types';
import DynamicForm from '@/features/forms/DynamicForm/DynamicForm';
import HelloScreen from '@/features/auth/Register/HelloScreen/HelloScreen';
import { useUserStore } from '@/entities/user/store/userStore';
import { useTestResultsStore } from '@/entities/tests/store/testResultsStore';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const NewRegisterPage = () => {
  const { setNotification, setAiTokens } = useUserStore();
  const formData = transformJsonToFormData(registrationData);
  const navigation = useNavigation<NavigationProp>();
  const { addResult } = useTestResultsStore();
  const { setUser } = useUser();

  const handleFormComplete = async (answers: FormAnswers) => {
    const testResult = formatAnswersToTestResult(formData, answers);
    addResult(testResult);

    setUser(answers);
    setNotification(answers.notification);

    await removeAllReminders();
    if (answers.notification.active) {
      await setReminders(new Date(answers.notification.time));
    }
    setAiTokens(3);

    Alert.alert('Регистрация завершена!', 'Добро пожаловать в приложение!', [
      {
        text: 'Продолжить',
        onPress: () => {
          navigation.replace('OnboardingPage');
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
