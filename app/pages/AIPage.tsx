import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import React, { useState } from 'react';

import { formatDateRange } from '@/shared/utils/date';
import Text from '@/shared/ui/Text';
import { showAIQuestionModal } from '@/shared/ui/AIQuestionModal/showAIQuestionModal';
import { Button } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { useDaysPosts } from '@/shared/hooks/useDaysPosts';
import { SPACING } from '@/shared/constants';
import { sendToGPT } from '@/shared/api/AIActions';
import { useUserStore } from '@/entities/user/store/userStore';
import { useLentStore } from '@/entities/lent/store/store';
import { weekAnalysisPrompt, questionPrompt } from '@/entities/assiatent/promts';

type AIBlock = {
  id: string;
  title: string;
  description: string;
  action: () => void | Promise<void>;
};

const AIPage = ({ changeTab }: { changeTab: (tab: number) => void }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { postsData, checkIns } = useDaysPosts(4);
  const { addCustomPost } = useLentStore();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { ai_tokens, minusAiToken } = useUserStore();

  const checkAiTokens = () => {
    if (ai_tokens <= 0) {
      Alert.alert('У вас закончились токены(');
      return false;
    }
    return true;
  };

  const aiBlocks: AIBlock[] = [
    {
      id: '1',
      title: 'Анализ недели',
      description:
        'Расскажем нейросети о твоей неделе — и вернём вдохновляющие советы, которые помогут почувствовать себя лучше 💛',
      action: async () => {
        // if (!checkAiTokens()) {
        //   return;
        // }

        try {
          setIsLoading(true);
          const prompt = weekAnalysisPrompt(checkIns, user.userData || {});

          const aiResponseID = await sendToGPT(prompt);

          if (typeof aiResponseID === 'number') {
            console.log('====================================');
            console.log(aiResponseID);
            console.log('====================================');
            minusAiToken();
          }

          addCustomPost({
            date: new Date().toISOString(),
            id: aiResponseID,
            type: 'ai_text',
            title: 'AI Анализ недели' + ' ' + formatDateRange(new Date().toISOString()),
            data: {
              status: 'processing',
              result: '',
            },
          });
          changeTab(0);
          setIsLoading(false);
        } catch {
          setIsLoading(false);
          Alert.alert('Произошла ошибка(');
          return;
        }
      },
    },
    {
      id: '2',
      title: 'Задать вопрос',
      description:
        'Спроси что угодно у нашего AI-психолога — и получи тёплый, персональный совет на основе твоих записей 🪄',
      action: async () => {
        // if (!checkAiTokens()) {
        //   return;
        // }

        try {
          const question = await showAIQuestionModal();
          changeTab(0);
          const prompt = questionPrompt(postsData.slice(0, 2), user.userData, question);
          const aiResponseID = await sendToGPT(prompt);

          if (typeof aiResponseID === 'number') {
            minusAiToken();
          }

          addCustomPost({
            date: new Date().toISOString(),
            id: aiResponseID,
            type: 'ai_text',
            title: `AI Ответ на вопрос: ${question}`,
            data: {
              status: 'processing',
              result: '',
            },
          });
        } catch {
          console.log('Пользователь отменил ввод вопроса');
        }
      },
    },
  ];

  const renderAIBlock = ({ item }: { item: AIBlock }) => (
    <View style={styles.blockContainer}>
      <Text style={styles.blockTitle} variant='h3'>
        {item.title}
      </Text>
      <Text style={styles.blockDescription} variant='body2'>
        {item.description}
      </Text>
      <Button
        fullWidth
        loading={isLoading}
        title='Начать'
        variant='outline'
        onPress={item.action}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle} variant='h2'>
        AI Помощник
      </Text>

      <View style={{ marginBottom: SPACING.LARGE }}>
        <Text style={{ color: colors.PRIMARY }} variant='h3'>
          {ai_tokens} <Icon color={colors.PRIMARY} name='star' size={18} />
        </Text>
      </View>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={aiBlocks}
        keyExtractor={(item) => item.id}
        renderItem={renderAIBlock}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
      paddingHorizontal: SPACING.LARGE,
    },
    pageTitle: {
      color: colors.TEXT_PRIMARY,
      textAlign: 'left',
      marginBottom: SPACING.LARGE,
    },
    listContainer: {
      paddingBottom: SPACING.LARGE,
    },
    blockContainer: {
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderRadius: 14,
      padding: SPACING.LARGE,
      marginBottom: SPACING.MEDIUM,
      borderWidth: 1,
      borderColor: colors.BORDER,
    },
    blockTitle: {
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.SMALL,
    },
    blockDescription: {
      color: colors.TEXT_SECONDARY,
      marginBottom: SPACING.LARGE,
      lineHeight: 22,
    },
  });

export default AIPage;
