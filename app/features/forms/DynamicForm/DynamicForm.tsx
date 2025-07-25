import { SafeAreaView } from 'react-native-safe-area-context';
import CarouselLib, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { View, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useRef } from 'react';

import FormStep from './FormStep';

import { FormTest, FormAnswers } from '@/shared/types/form.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DynamicFormProps = {
  formData: FormTest;
  stickyButton?: boolean;
  onComplete: (answers: FormAnswers) => void;
  customFirstStep?: React.ComponentType<{ onNext: () => void }>;
};

type CarouselItemData = {
  type: 'custom' | 'form';
  stepData?: any;
  stepIndex: number;
};

const DynamicForm = ({
  formData,
  onComplete,
  customFirstStep: CustomFirstStep,
  stickyButton,
}: DynamicFormProps) => {
  const [answers, setAnswers] = useState<FormAnswers>({});
  const carouselRef = useRef<ICarouselInstance>(null);

  const handleAnswerChange = (questionName: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionName]: answer,
    }));
  };

  const nextStep = () => {
    carouselRef.current?.next();
  };

  const prevStep = () => {
    carouselRef.current?.prev();
  };

  const carouselData: CarouselItemData[] = formData.data.map((step, index) => ({
    type: 'form',
    stepData: step,
    stepIndex: CustomFirstStep ? index + 1 : index,
  }));

  const renderItem = ({ item }: { item: CarouselItemData }) => {
    if (item.type === 'custom' && CustomFirstStep) {
      return (
        <View style={styles.carouselItem}>
          <CustomFirstStep onNext={nextStep} />
        </View>
      );
    }

    if (item.type === 'form') {
      const isLastStep = item.stepIndex === carouselData.length - 1;

      const handleNext = () => {
        if (isLastStep) {
          onComplete(answers);
        } else {
          nextStep();
        }
      };

      const handlePrev = item.stepIndex > 0 ? prevStep : undefined;

      return (
        <View style={styles.carouselItem}>
          <FormStep
            answers={answers}
            step={item.stepData}
            stepIndex={item.stepIndex}
            stickyButton={stickyButton}
            title={formData.name}
            totalSteps={carouselData.length}
            onAnswerChange={handleAnswerChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </View>
      );
    }

    return <View style={styles.carouselItem} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <CarouselLib
        containerStyle={styles.containerStyle}
        data={carouselData}
        enabled={false}
        height={Dimensions.get('screen').height}
        loop={false}
        mode='parallax'
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 0.5,
          parallaxAdjacentItemScale: 0.6,
        }}
        ref={carouselRef}
        renderItem={renderItem}
        style={styles.carousel}
        width={SCREEN_WIDTH}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carousel: {
    flex: 1,
    height: Dimensions.get('screen').height,
  },
  carouselItem: {
    flex: 1,
    height: Dimensions.get('screen').height,
    width: SCREEN_WIDTH,
  },
  containerStyle: {
    width: '100%',
    height: Dimensions.get('screen').height,
    position: 'absolute',
    top: 0,
  },
});

export default DynamicForm;
