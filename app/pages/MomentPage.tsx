import React from 'react';
import jsonData from 'apptests/moment.json';
import { useNavigation } from '@react-navigation/native';

import {
  transformJsonToFormData,
  formatAnswersToTestResult,
  convertTestResultToMomentPost,
} from '@/shared/utils/formUtils';
import { FormAnswers } from '@/shared/types/form.types';
import DynamicForm from '@/features/forms/DynamicForm/DynamicForm';
import { useTestResultsStore } from '@/entities/tests/store/testResultsStore';
import { useLentStore } from '@/entities/lent/store/store';

const CheckInPage = () => {
  const formData = transformJsonToFormData(jsonData);
  const navigation = useNavigation();
  const { addResult } = useTestResultsStore();
  const { addCustomPost } = useLentStore();

  const handleFormComplete = (answers: FormAnswers) => {
    const testResult = formatAnswersToTestResult(formData, answers);
    const momentPost = convertTestResultToMomentPost(testResult);

    if (Object.keys(momentPost.data).length) {
      addResult(testResult);
      addCustomPost(momentPost);
    }

    navigation.goBack();
  };
  return <DynamicForm stickyButton formData={formData} onComplete={handleFormComplete} />;
};

export default CheckInPage;
