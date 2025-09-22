import {
  CheckInPost,
  CheckInPostData,
  MomentInPost,
  MomentPostData,
  NotePost,
  NotePostData,
} from '@/types/lentTypes';
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
  const data: CheckInPostData = {
    mood: '',
    activities: [],
    emotions: [],
  };

  testResult.data.forEach((question) => {
    //@ts-ignore
    data[question.name as keyof CheckInPostData] = question.answer;
  });

  return {
    date: testResult.date,
    id: `checkin_${Date.now()}`,
    type: 'check-in',
    data,
  };
};
export const convertTestResultToMomentPost = (testResult: TestResult): MomentInPost => {
  const data: MomentPostData = {};

  testResult.data.forEach((question) => {
    //@ts-ignore
    data[question.name as keyof MomentPostData] = question.answer;
  });

  return {
    date: testResult.date,
    id: `moment_${Date.now()}`,
    type: 'moment',
    data,
  };
};

export const convertTestResultToNotePost = (testResult: TestResult): NotePost => {
  const data = {};
  testResult.data.forEach((question) => {
    //@ts-ignore
    data[question.name as keyof NotePostData] = question.answer;
  });

  return {
    date: testResult.date,
    id: `note_${Date.now()}`,
    type: 'note',
    data: data as NotePostData,
  };
};
