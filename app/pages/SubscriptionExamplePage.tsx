import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { SubscriptionBanner } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { RootStackParamList } from '@/navigation/types';
import DynamicForm from '@/features/forms/DynamicForm/DynamicForm';

// Пример данных формы
const exampleFormData = {
  id: 1,
  name: 'Тестовая форма',
  data: [
    {
      title: 'Шаг 1',
      questions: [
        {
          name: 'question1',
          type: 'text' as const,
          question: 'Ваш ответ на первый вопрос',
        },
      ],
    },
    {
      title: 'Шаг 2',
      questions: [
        {
          name: 'question2',
          type: 'text' as const,
          question: 'Ваш ответ на второй вопрос',
        },
      ],
    },
  ],
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SubscriptionExamplePage: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<NavigationProp>();

  const [showForm, setShowForm] = useState(false);

  const handleBannerPress = () => {
    navigation.navigate('PaywallPage', {
      onSuccess: () => {
        setShowForm(true);
      },
    });
  };

  const handleFormComplete = (_answers: any) => {
    setShowForm(false);
  };

  const handleRegistrationComplete = (_data: any) => {
    // Регистрация завершена
  };

  if (showForm) {
    return (
      <DynamicForm
        enableRegistration={true}
        formData={exampleFormData}
        onComplete={handleFormComplete}
        onRegistrationComplete={handleRegistrationComplete}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.section}>
          <SubscriptionBanner
            subtitle='Получите персонального AI-ассистента'
            title='Разблокируйте все возможности'
            onPress={handleBannerPress}
          />
        </View>

        <View style={styles.section}>
          <SubscriptionBanner
            subtitle='Активируйте подписку для полного доступа'
            title='PRO функции доступны'
            onPress={handleBannerPress}
          />
        </View>

        <View style={styles.section}>
          <SubscriptionBanner
            subtitle='3 дня бесплатного доступа ко всем функциям'
            title='Попробуйте бесплатно'
            onPress={handleBannerPress}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    content: {
      flex: 1,
    },
    section: {
      paddingTop: 20,
    },
  });

export default SubscriptionExamplePage;
