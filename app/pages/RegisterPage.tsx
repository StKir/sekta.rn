import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import React, { useState, useRef, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import RegisterStepOne from '../features/auth/RegisterStepOne/RegisterStepOne';
import HelloScreen from '../features/auth/HelloScreen/HelloScreen';

import { StorageService } from '@/shared/utils/storage';
import Text from '@/shared/components/Text/Text';
import { RootStackParamList } from '@/navigation/types';
import RegisterStepTwo from '@/features/auth/RegisterStepTwo/RegisterStepTwo';
import RegisterStepFour from '@/features/auth/RegisterStepFour/RegisterStepFour';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type RegisterFormData = {
  name: string;
  age: string;
  sex: 'male' | 'female' | 'other' | null;
  email: string;
  password: string;
  confirmPassword: string;
  feeling: 'normal' | 'not_good' | 'bad' | 'great' | null;
  stress: 'often' | 'sometimes' | 'rarely' | 'never' | null;
  habits: 'yes' | 'no' | null;
  tracking: ('mood' | 'stress' | 'energy' | 'sleep')[];
  avatar: '😊' | '😎' | '🤔' | '😌' | '😇' | '🤓' | '😉' | '😄' | null;
  appUsage: 'yes' | 'no' | null;
  communicationStyle: 'friendly' | 'calm' | 'humorous' | null;
};

const steps = [
  {
    name: 'helloScreen',
    component: (onNext: () => unknown) => <HelloScreen onNext={onNext} />,
  },
  {
    name: 'stepOne',
    component: (onNext: () => unknown, prevStep: () => unknown) => (
      <RegisterStepOne onNext={onNext} onPrev={prevStep} />
    ),
    subtitle: 'Основная информация',
  },
  {
    name: 'stepTwo',
    component: (onNext: () => unknown, prevStep: () => unknown) => (
      <RegisterStepTwo onNext={onNext} onPrev={prevStep} />
    ),
    subtitle: 'Детали о тебе',
  },
  {
    name: 'stepFour',
    component: (onNext: () => unknown) => <RegisterStepFour onNext={onNext} />,
    subtitle: 'Финальный штрих',
  },
];

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation<NavigationProp>();

  const methods = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      age: '',
      sex: null,
      email: '',
      password: '',
      confirmPassword: '',
      feeling: null,
      stress: null,
      habits: null,
      tracking: [],
      avatar: null,
      appUsage: null,
      communicationStyle: null,
    },
  });

  const nextStep = async () => {
    if (currentStep === steps.length - 1) {
      const formData = methods.getValues();
      await StorageService.setUser(formData);
      navigation.replace('TabNavigator');
      return;
    }

    if (currentStep < steps.length - 1) {
      Animated.timing(slideAnim, {
        toValue: -(currentStep + 1) * SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      Animated.timing(slideAnim, {
        toValue: -(currentStep - 1) * SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });

    if (steps[currentStep].subtitle) {
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(headerAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [currentStep, headerAnim]);

  return (
    <View style={{ flex: 1 }}>
      <FormProvider {...methods}>
        <SafeAreaView style={styles.container}>
          {steps[currentStep].subtitle && (
            <Animated.View
              style={{
                transform: [{ translateY: headerAnim }],
                opacity: headerAnim.interpolate({
                  inputRange: [-100, 0],
                  outputRange: [0, 1],
                }),
              }}
            >
              <HeaderTitle subtitle={steps[currentStep].subtitle || ''} title={'Регистрация'} />
            </Animated.View>
          )}

          <Animated.View
            style={[
              styles.stepsContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {steps.map((el) => (
              <View key={el.name} style={styles.step}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {el.subtitle && <View style={{ paddingTop: 100 }} />}
                  {el.component(nextStep, prevStep)}
                </ScrollView>
              </View>
            ))}
          </Animated.View>
        </SafeAreaView>
      </FormProvider>
    </View>
  );
};

const HeaderTitle = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <View style={styles.headerContainer}>
      <Text color='primary' variant='h1'>
        {title}
      </Text>
      <Text color='textPrimary' variant='body1'>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  headerContainer: {
    position: 'absolute',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepsContainer: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 4,
    height: '100%',
  },
  step: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default RegisterPage;
