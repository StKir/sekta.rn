import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { formatDateRange } from '@/shared/utils/date';
import Text from '@/shared/ui/Text';
import { showAIQuestionModal } from '@/shared/ui/AIQuestionModal/showAIQuestionModal';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { useDaysPosts } from '@/shared/hooks/useDaysPosts';
import { useDailyFirstLogin } from '@/shared/hooks/useDailyFirstLogin';
import { SPACING } from '@/shared/constants';
import { sendToGPT } from '@/shared/api/AIActions';
import { RootStackParamList } from '@/navigation/types';
import { useUserStore } from '@/entities/user/store/userStore';
import { useLentStore } from '@/entities/lent/store/store';
import { weekAnalysisPrompt, questionPrompt } from '@/entities/assiatent/promts';
import { AICard } from '@/entities/ai/AiCard';

type AIBlock = {
  id: string;
  title: string;
  description: string;
  action: () => void | Promise<void>;
};

const AIPage = ({ changeTab }: { changeTab: (tab: number) => void }) => {
  useDailyFirstLogin();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { postsData, checkIns } = useDaysPosts(4);
  const { addCustomPost } = useLentStore();
  const user = useUser();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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
        if (!checkAiTokens()) {
          return;
        }

        try {
          const prompt = weekAnalysisPrompt(checkIns, user.userData || {});

          const aiResponseID = await sendToGPT(prompt);

          if (typeof aiResponseID === 'number') {
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
        } catch {
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
        if (!checkAiTokens()) {
          return;
        }

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
    {
      id: '3',
      title: 'Составить плейлист',
      description: 'Составим плейлист на основе твоих записей и предпочтений.',
      action: async () => {
        if (!checkAiTokens()) {
          return;
        }
        navigation.navigate('AiPlayListPage');
        return;
      },
    },
    {
      id: '4',
      title: 'Придумать планы',
      description:
        'Отправим нейросети контекст твоей жизни и пожелания взамен получим подбрку идей на неделю/выходные/вечер',
      action: async () => {
        if (!checkAiTokens()) {
          return;
        }
        navigation.navigate('AiPlans');
        return;
      },
    },
  ];

  const renderAIBlock = ({ item }: { item: AIBlock }) => (
    <AICard description={item.description} title={item.title} onPress={item.action} />
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
        ListFooterComponent={<View style={{ height: 100 }} />}
        ListHeaderComponent={
          <View style={{ marginBottom: SPACING.LARGE }}>
            <View style={{ marginBottom: SPACING.LARGE }}>
              <Text style={{ color: colors.PRIMARY }} variant='h3'>
                {ai_tokens} <Icon color={colors.PRIMARY} name='star' size={18} />
              </Text>
            </View>
            <Text color='textSecondary' variant='body2'>
              Получайте токены каждый день за вход в приложение
            </Text>
          </View>
        }
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
  });

export default AIPage;
