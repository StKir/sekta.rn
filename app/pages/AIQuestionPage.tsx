import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import TextArea from '@/shared/ui/TextArea';
import Text from '@/shared/ui/Text';
import { Button } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';
import { RootStackParamList } from '@/navigation/types';
import { useLentStore } from '@/entities/lent/store/store';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AIQuestionPage = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<NavigationProp>();
  const [question, setQuestion] = useState('');
  const { posts } = useLentStore();

  const getLastFiveDaysPosts = () => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    return posts.filter((post) => {
      const postDate = new Date(post.date);
      return postDate >= fiveDaysAgo;
    });
  };

  const handleComplete = () => {
    const lastFiveDaysPosts = getLastFiveDaysPosts();

    const prompt = `Представь что ты профессиональный психолог, я твой пациент и задаю тебе вопрос: "${question}". Ответь на него на основе и проанализировав контекст последних моих пяти дней жизни.`;

    const postsData = JSON.stringify(lastFiveDaysPosts, null, 2);

    console.log(prompt);
    console.log(postsData);

    // Возвращаемся назад после обработки
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.pageTitle} variant='h2'>
          Задать вопрос AI
        </Text>

        <Text style={styles.description} variant='body1'>
          Задайте любой вопрос нашему AI-психологу. Он проанализирует ваши записи за последние 5
          дней и даст персональную рекомендацию.
        </Text>

        <View style={styles.inputContainer}>
          <TextArea
            label='Ваш вопрос'
            multiline={true}
            numberOfLines={6}
            placeholder='Например: Как мне справиться со стрессом на работе? Почему у меня плохое настроение?'
            style={styles.questionInput}
            value={question}
            onChangeText={setQuestion}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          fullWidth
          disabled={!question.trim()}
          title='Завершить'
          variant='primary'
          onPress={handleComplete}
        />
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: SPACING.LARGE,
      paddingBottom: SPACING.XLARGE,
    },
    pageTitle: {
      color: colors.TEXT_PRIMARY,
      textAlign: 'left',
      marginBottom: SPACING.MEDIUM,
    },
    description: {
      color: colors.TEXT_SECONDARY,
      marginBottom: SPACING.LARGE,
      lineHeight: 22,
    },
    inputContainer: {
      flex: 1,
      marginBottom: SPACING.LARGE,
    },
    questionInput: {
      minHeight: 200,
      textAlignVertical: 'top',
    },
    bottomContainer: {
      paddingHorizontal: SPACING.LARGE,
      paddingBottom: SPACING.LARGE,
      paddingTop: SPACING.MEDIUM,
      backgroundColor: colors.BACKGROUND_PRIMARY,
      borderTopWidth: 1,
      borderTopColor: colors.BORDER,
    },
  });

export default AIQuestionPage;
