import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useState } from 'react';

import TextArea from '@/shared/ui/TextArea';
import Text from '@/shared/ui/Text';
import { Button } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';

interface AIQuestionModalProps {
  onComplete: (question: string) => void;
  onCancel: () => void;
}

const AIQuestionModal = ({ onComplete, onCancel }: AIQuestionModalProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [question, setQuestion] = useState('');

  const handleComplete = () => {
    if (question.trim()) {
      onComplete(question.trim());
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <View style={styles.container}>
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
        <View style={styles.buttonRow}>
          <Button
            style={styles.cancelButton}
            title='Отмена'
            variant='outline'
            onPress={handleCancel}
          />
          <Button
            disabled={!question.trim()}
            style={styles.completeButton}
            title='Завершить'
            variant='primary'
            onPress={handleComplete}
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      height: '100%',
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
      minHeight: 150,
      textAlignVertical: 'top',
    },
    bottomContainer: {
      paddingHorizontal: SPACING.LARGE,
      paddingBottom: SPACING.LARGE,
      paddingTop: SPACING.MEDIUM,
      borderTopWidth: 1,
      borderTopColor: colors.BORDER,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: SPACING.MEDIUM,
    },
    cancelButton: {
      flex: 1,
    },
    completeButton: {
      flex: 2,
    },
  });

export default AIQuestionModal;
