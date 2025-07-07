import { CheckInPost, CheckInPostData } from '@/types/lentTypes';
import { TestResult, TestResultQuestion } from '@/shared/types/testResult.types';
import { FormTest, FormAnswers } from '@/shared/types/form.types';

export const addAnswersToFormData = (formData: FormTest, answers: FormAnswers): FormTest => {
  return {
    ...formData,
    data: formData.data.map((step) => ({
      ...step,
      questions: step.questions.map((question) => ({
        ...question,
        answer: answers[question.name],
      })),
    })),
  };
};

export const transformJsonToFormData = (jsonData: any[]): FormTest => {
  const testData = jsonData[0];

  return {
    id: testData.id,
    name: testData.name,
    data: testData.data.map((stepArray: any[]) => ({
      questions: stepArray.map((question: any) => {
        const transformedQuestion = { ...question };

        if (question.required !== undefined) {
          transformedQuestion.validation = {
            ...(transformedQuestion.validation || {}),
            required: question.required,
          };
          delete transformedQuestion.required;
        }

        return transformedQuestion;
      }),
    })),
  };
};

export const formatAnswersToTestResult = (formData: FormTest, answers: FormAnswers): TestResult => {
  const data: TestResultQuestion[] = [];

  formData.data.forEach((step) => {
    step.questions.forEach((question) => {
      if (question.type !== 'title') {
        const answer = answers[question.name];

        if (answer !== undefined && answer !== null && answer !== '') {
          data.push({
            type: question.type,
            id: question.id,
            name: question.name,
            question: question.question,
            answer: answer,
          });
        }
      }
    });
  });

  return {
    test: formData.name,
    id: formData.id,
    date: new Date().toISOString(),
    data: data,
  };
};

export const convertTestResultToCheckInPost = (testResult: TestResult): CheckInPost => {
  const checkInData: CheckInPostData = {
    mood: '',
    activities: [],
    emotions: [],
  };

  testResult.data.forEach((question) => {
    switch (question.name) {
      case 'mood':
        checkInData.mood = question.answer;
        break;
      case 'color':
        checkInData.color = question.answer;
        break;
      case 'quote':
        checkInData.quote = question.answer;
        break;
      case 'note':
        checkInData.note = question.answer;
        break;
      case 'media':
        checkInData.media = question.answer;
        break;
      case 'activities':
        checkInData.activities = Array.isArray(question.answer) ? question.answer : [];
        break;
      case 'emotions':
        checkInData.emotions = Array.isArray(question.answer) ? question.answer : [];
        break;
    }
  });

  return {
    date: testResult.date,
    id: `checkin_${Date.now()}`,
    type: 'check-in',
    data: checkInData,
  };
};
