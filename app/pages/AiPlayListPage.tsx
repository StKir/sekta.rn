import { Alert } from 'react-native';
import React from 'react';
import jsonData from 'apptests/playlist.json';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { transformJsonToFormData } from '@/shared/utils/formUtils';
import { FormAnswers } from '@/shared/types/form.types';
import { useUser } from '@/shared/hooks/useUser';
import { useDaysPosts } from '@/shared/hooks/useDaysPosts';
import { sendToGPT } from '@/shared/api/AIActions';
import { RootStackParamList } from '@/navigation/types';
import DynamicForm from '@/features/forms/DynamicForm/DynamicForm';
import { useUserStore } from '@/entities/user/store/userStore';
import { useLentStore } from '@/entities/lent/store/store';
import { playlistPrompt } from '@/entities/assiatent/promts';

const AiPlayListPage = () => {
  const formData = transformJsonToFormData(jsonData);
  const { postsData } = useDaysPosts(4);
  const user = useUser();
  const { minusAiToken } = useUserStore();
  const { addCustomPost } = useLentStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleFormComplete = async (answers: FormAnswers) => {
    if (!answers.name) {
      Alert.alert('Название плейлиста не может быть пустым');
      return;
    }
    try {
      const prompt = playlistPrompt(postsData.slice(0, 5), user.userData, JSON.stringify(answers));
      const aiResponseID = await sendToGPT(prompt);

      if (typeof aiResponseID === 'number') {
        minusAiToken();
      }

      addCustomPost({
        date: new Date().toISOString(),
        id: aiResponseID,
        type: 'ai_text',
        title: `Плейлист на основе ${answers.name}`,
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

export default AiPlayListPage;
