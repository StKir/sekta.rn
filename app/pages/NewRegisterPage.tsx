import React from 'react';
import registrationData from 'appData/apptests/registration.json';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { removeAllReminders, setReminders } from '@/shared/utils/reminder';
import { Metrics } from '@/shared/utils/metrics';
import { transformJsonToFormData, formatAnswersToTestResult } from '@/shared/utils/formUtils';
import { FormAnswers } from '@/shared/types/form.types';
import { RootStackParamList } from '@/navigation/types';
import DynamicForm from '@/features/forms/DynamicForm/DynamicForm';
import { useUserStore } from '@/entities/user/store/userStore';
import { useTestResultsStore } from '@/entities/tests/store/testResultsStore';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const NewRegisterPage = () => {
  const { setNotification, setAiTokens } = useUserStore();
  const formData = transformJsonToFormData(registrationData);
  const navigation = useNavigation<NavigationProp>();
  const { addResult } = useTestResultsStore();
  const { setUser } = useUserStore();

  const handleFormComplete = async (answers: FormAnswers) => {
    const testResult = formatAnswersToTestResult(formData, answers);
    addResult(testResult);

    try {
      console.log(answers);

      setUser(answers);
      setNotification(answers?.notification);

      await removeAllReminders();

      if (answers?.notification?.active) {
        await setReminders(new Date(answers.notification.time));
      }

      setAiTokens(20);
      Metrics.registrationCompleted();
      navigation.replace('TabNavigator');
    } catch (error) {
      console.log(error);
    }
  };

  return <DynamicForm formData={formData} showBackButton={true} onComplete={handleFormComplete} />;
};

export default NewRegisterPage;
