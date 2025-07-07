import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import React, { useState, useRef } from 'react';

import FormStep from './FormStep';

import { FormTest, FormAnswers } from '@/shared/types/form.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DynamicFormProps = {
  formData: FormTest;
  onComplete: (answers: FormAnswers) => void;
  customFirstStep?: React.ComponentType<{ onNext: () => void }>;
};

const DynamicForm = ({
  formData,
  onComplete,
  customFirstStep: CustomFirstStep,
}: DynamicFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<FormAnswers>({});
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleAnswerChange = (questionName: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionName]: answer,
    }));
  };

  const animateTransition = (direction: 'next' | 'prev', callback: () => void) => {
    const slideValue = direction === 'next' ? -SCREEN_WIDTH : SCREEN_WIDTH;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: slideValue,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(direction === 'next' ? SCREEN_WIDTH : -SCREEN_WIDTH);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const nextStep = () => {
    if (CustomFirstStep && currentStep === 0) {
      animateTransition('next', () => setCurrentStep(1));
      return;
    }

    const formStepIndex = CustomFirstStep ? currentStep - 1 : currentStep;

    if (formStepIndex === formData.data.length - 1) {
      onComplete(answers);
      return;
    }

    if (formStepIndex < formData.data.length - 1) {
      animateTransition('next', () => setCurrentStep(currentStep + 1));
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      animateTransition('prev', () => setCurrentStep(currentStep - 1));
    }
  };

  const animatedStyle = {
    transform: [{ translateX: slideAnim }],
    opacity: fadeAnim,
  };

  if (CustomFirstStep && currentStep === 0) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <CustomFirstStep onNext={nextStep} />
        </Animated.View>
      </View>
    );
  }

  const formStepIndex = CustomFirstStep ? currentStep - 1 : currentStep;
  const currentStepData = formData.data[formStepIndex];
  const totalSteps = formData.data.length + (CustomFirstStep ? 1 : 0);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <FormStep
          answers={answers}
          step={currentStepData}
          stepIndex={currentStep}
          title={formData.name}
          totalSteps={totalSteps}
          onAnswerChange={handleAnswerChange}
          onNext={nextStep}
          onPrev={currentStep > 0 ? prevStep : undefined}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
});

export default DynamicForm;
