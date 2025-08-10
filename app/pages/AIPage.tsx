import { StyleSheet, View, FlatList } from 'react-native';
import React from 'react';

import { formatDateRange } from '@/shared/utils/date';
import Text from '@/shared/ui/Text';
import { showAIQuestionModal } from '@/shared/ui/AIQuestionModal/showAIQuestionModal';
import { Button } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { useDaysPosts } from '@/shared/hooks/useDaysPosts';
import { SPACING } from '@/shared/constants';
import { sendToGPT_4oMini } from '@/shared/api/AIActions';
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

  const aiBlocks: AIBlock[] = [
    {
      id: '1',
      title: 'Анализ недели',
      description:
        'Расскажем нейросети о твоей неделе — и вернём вдохновляющие советы, которые помогут почувствовать себя лучше 💛',
      action: async () => {
        const prompt = weekAnalysisPrompt(checkIns, user.userData || {});

        const aiResponseID = await sendToGPT_4oMini(prompt);

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
      },
    },
    {
      id: '2',
      title: 'Задать вопрос',
      description:
        'Спроси что угодно у нашего AI-психолога — и получи тёплый, персональный совет на основе твоих записей 🪄',
      action: async () => {
        try {
          const question = await showAIQuestionModal();

          const prompt = questionPrompt(postsData.slice(0, 2), user.userData, question);
          const aiResponseID = await sendToGPT_4oMini(prompt);
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
          changeTab(0);
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
      <Button fullWidth title='Начать' variant='outline' onPress={item.action} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle} variant='h2'>
        AI Помощник
      </Text>
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
      borderRadius: 25,
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
