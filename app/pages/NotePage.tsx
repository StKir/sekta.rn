import React from 'react';
import jsonData from 'apptests/note.json';
import { useNavigation } from '@react-navigation/native';

import {
  transformJsonToFormData,
  formatAnswersToTestResult,
  convertTestResultToNotePost,
} from '@/shared/utils/formUtils';
import { FormAnswers } from '@/shared/types/form.types';
import DynamicForm from '@/features/forms/DynamicForm/DynamicForm';
import { useTestResultsStore } from '@/entities/tests/store/testResultsStore';
import { useLentStore } from '@/entities/lent/store/store';

const NotePage = () => {
  const formData = transformJsonToFormData(jsonData);
  const navigation = useNavigation();
  const { addResult } = useTestResultsStore();
  const { addCustomPost } = useLentStore();

  const handleFormComplete = (answers: FormAnswers) => {
    const testResult = formatAnswersToTestResult(formData, answers);
    const notePost = convertTestResultToNotePost(testResult);

    addResult(testResult);
    addCustomPost(notePost);

    navigation.goBack();
  };
  return <DynamicForm stickyButton formData={formData} onComplete={handleFormComplete} />;
};

export default NotePage;
