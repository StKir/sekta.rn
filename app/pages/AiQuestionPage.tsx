import { Alert } from 'react-native';
import React from 'react';
import jsonData from 'appData/apptests/question.json';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { transformJsonToFormData } from '@/shared/utils/formUtils';
import { FormAnswers } from '@/shared/types/form.types';
import { useUser } from '@/shared/hooks/useUser';
import { useSubscription } from '@/shared/hooks/useSubscription';
import { useDaysPosts } from '@/shared/hooks/useDaysPosts';
import { sendToAI } from '@/shared/api/AIActions';
import { RootStackParamList } from '@/navigation/types';
import DynamicForm from '@/features/forms/DynamicForm/DynamicForm';
import { useLentStore } from '@/entities/lent/store/store';
import { questionPrompt } from '@/entities/assiatent/promts';
import { Metrics } from '@/shared/utils/metrics';

const AiQuestionPage = () => {
  const formData = transformJsonToFormData(jsonData);
  const { postsData } = useDaysPosts(4);
  const user = useUser();
  const { checkSubscription } = useSubscription();
  const { addCustomPost } = useLentStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleFormComplete = async (answers: FormAnswers) => {
    if (!answers.question) {
      Alert.alert('Ошибка', 'Вопрос не может быть пустым');
      return;
    }

    try {
      const hasAccess = await checkSubscription();
      if (!hasAccess) {
        return;
      }

      const emotionsText = answers.emotions
        ? `Мое настроение: ${answers.emotions.join(', ')}. `
        : '';

      const questionText = `Эмоции:${emotionsText} Вопрос:${answers.question}`;
      const prompt = questionPrompt(postsData.slice(0, 2), user.userData, questionText);
      const aiResponseID = await sendToAI(prompt);

      if (typeof aiResponseID === 'number') {
        addCustomPost({
          date: new Date().toISOString(),
          id: aiResponseID,
          type: 'ai_text',
          title: `Вопрос: ${answers.question.substring(0, 30)}${
            answers.question.length > 30 ? '...' : ''
          }`,
          data: {
            status: 'processing',
            result: '',
          },
        });
        Metrics.aiUsed('question');
      }

      navigation.goBack();
    } catch {
      Alert.alert('Ошибка', 'Не удалось получить ответ. Попробуйте позже.');
    }
  };

  return <DynamicForm stickyButton formData={formData} onComplete={handleFormComplete} />;
};

export default AiQuestionPage;
