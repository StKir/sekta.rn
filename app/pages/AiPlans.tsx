import { Alert } from 'react-native';
import React from 'react';
import jsonData from 'appData/apptests/plans.json';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { transformJsonToFormData } from '@/shared/utils/formUtils';
import { FormAnswers } from '@/shared/types/form.types';
import { useUser } from '@/shared/hooks/useUser';
import { useDaysPosts } from '@/shared/hooks/useDaysPosts';
import { sendToAI } from '@/shared/api/AIActions';
import { RootStackParamList } from '@/navigation/types';
import DynamicForm from '@/features/forms/DynamicForm/DynamicForm';
import { useUserStore } from '@/entities/user/store/userStore';
import { useLentStore } from '@/entities/lent/store/store';
import { plansPrompt } from '@/entities/assiatent/promts';

const AiPlans = () => {
  const formData = transformJsonToFormData(jsonData);
  const { postsData } = useDaysPosts(4);
  const user = useUser();
  const { minusAiToken } = useUserStore();
  const { addCustomPost } = useLentStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleFormComplete = async (answers: FormAnswers) => {
    if (!answers.time || !answers.type) {
      Alert.alert('Укажите время и тип занятия');
      return;
    }
    try {
      const hasAccess = await user.checkSubscription();
      if (!hasAccess) {
        return;
      }

      const prompt = plansPrompt(postsData.slice(0, 5), user.userData, JSON.stringify(answers));
      const aiResponseID = await sendToAI(prompt);

      if (typeof aiResponseID === 'number') {
        minusAiToken();
      }

      addCustomPost({
        date: new Date().toISOString(),
        id: aiResponseID,
        type: 'ai_text',
        title: `Планы на ${answers.time}`,
        data: {
          status: 'processing',
          result: '',
        },
      });
      navigation.goBack();
    } catch {
      console.log('Пользователь отменил ввод вопроса');
    }
  };
  return <DynamicForm stickyButton formData={formData} onComplete={handleFormComplete} />;
};

export default AiPlans;
