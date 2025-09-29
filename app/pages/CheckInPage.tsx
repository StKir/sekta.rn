import React from 'react';
import jsonData from 'appData/apptests/check.json';
import { useNavigation } from '@react-navigation/native';

import {
  transformJsonToFormData,
  formatAnswersToTestResult,
  convertTestResultToCheckInPost,
} from '@/shared/utils/formUtils';
import { FormAnswers } from '@/shared/types/form.types';
import DynamicForm from '@/features/forms/DynamicForm/DynamicForm';
import { useTestResultsStore } from '@/entities/tests/store/testResultsStore';
import { useLentStore } from '@/entities/lent/store/store';

const CheckInPage = () => {
  const formData = transformJsonToFormData(jsonData);
  const navigation = useNavigation();
  const { addResult } = useTestResultsStore();
  const { addCheckIn } = useLentStore();

  const handleFormComplete = (answers: FormAnswers) => {
    const testResult = formatAnswersToTestResult(formData, answers);
    const checkInPost = convertTestResultToCheckInPost(testResult);

    addResult(testResult);
    addCheckIn(checkInPost);

    navigation.goBack();
  };
  return <DynamicForm stickyButton formData={formData} onComplete={handleFormComplete} />;
};

export default CheckInPage;
