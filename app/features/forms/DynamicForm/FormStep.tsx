import React from 'react';

import QuestionRenderer from './QuestionRenderer';

import FormStepWrapper from '@/shared/ui/FormWrapper/FormStepWrapper';
import { Button } from '@/shared/ui';
import { FormStep as FormStepType, FormAnswers, FormQuestion } from '@/shared/types/form.types';

type FormStepProps = {
  step: FormStepType;
  stepIndex: number;
  totalSteps: number;
  answers: FormAnswers;
  onAnswerChange: (questionName: string, answer: any) => void;
  onNext: () => void;
  onPrev?: () => void;
  title?: string;
  stickyButton?: boolean;
};

const FormStep = ({
  step,
  stepIndex,
  totalSteps,
  answers,
  onAnswerChange,
  onNext,
  onPrev,
  title = 'Тест',
  stickyButton,
}: FormStepProps) => {
  const isLastStep = stepIndex === totalSteps - 1;
  const isFirstStep = stepIndex === 0;
  const isWelcomeStep = step.questions.length === 1 && step.questions[0].type === 'welcome';

  const titleBlock = step.questions.find((q) => q.type === 'title');

  const shouldShowHeader = !!titleBlock;

  const getSubtitle = () => {
    if (!titleBlock) {
      return undefined;
    }

    if (titleBlock.step === true) {
      return `Шаг ${stepIndex} из ${totalSteps - 1}`;
    }

    return titleBlock.description || undefined;
  };

  const actualQuestions = step.questions.filter((q) => q.type !== 'title');

  const validateField = (question: FormQuestion, answer: any) => {
    if (!question.validation) {
      return true;
    }

    const { required, minLength, min, max } = question.validation;

    if (required) {
      if (answer === undefined || answer === null) {
        return false;
      }

      if (question.type === 'select' || question.type === 'gender') {
        return answer !== '' && answer !== null && answer !== undefined;
      }

      if (question.type === 'color') {
        return answer && typeof answer === 'object' && answer.id && answer.name && answer.color;
      }

      if (question.type === 'multi_select') {
        return Array.isArray(answer) && answer.length > 0;
      }

      if (typeof answer === 'string' && answer.trim() === '') {
        return false;
      }
    }

    if (typeof answer === 'string') {
      if (minLength && answer.length < minLength) {
        return false;
      }

      const numValue = Number(answer);
      if (!isNaN(numValue)) {
        if (min !== undefined && numValue < min) {
          return false;
        }
        if (max !== undefined && numValue > max) {
          return false;
        }
      }
    }

    return true;
  };

  const isStepValid = () => {
    if (isWelcomeStep) {
      return true;
    }

    return actualQuestions.every((question) => {
      const answer = answers[question.name];
      return validateField(question, answer);
    });
  };

  if (isWelcomeStep) {
    return (
      <QuestionRenderer
        question={step.questions[0]}
        value={null}
        onChange={() => {}}
        onNext={onNext}
      />
    );
  }

  return (
    <>
      <FormStepWrapper
        showHeader={shouldShowHeader}
        subtitle={shouldShowHeader ? getSubtitle() : `Шаг ${stepIndex} из ${totalSteps - 1}`}
        title={shouldShowHeader ? titleBlock?.title || title : title}
      >
        {actualQuestions.map((question, index) => (
          <QuestionRenderer
            key={question.name || index}
            question={question}
            value={answers[question.name]}
            onChange={(value) => onAnswerChange(question.name, value)}
          />
        ))}

        {!stickyButton && (
          <Button
            fullWidth
            disabled={!isStepValid()}
            sticky={stickyButton}
            title={isLastStep ? 'Завершить' : 'Далее'}
            onPress={onNext}
          />
        )}

        {!isFirstStep && onPrev && <Button title='Назад' variant='secondary' onPress={onPrev} />}
      </FormStepWrapper>
      {stickyButton && (
        <Button
          fullWidth
          disabled={!isStepValid()}
          sticky={stickyButton}
          title={isLastStep ? 'Завершить' : 'Далее'}
          onPress={onNext}
        />
      )}
    </>
  );
};

export default FormStep;
