import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { formatDateRange } from '@/shared/utils/date';
import Text from '@/shared/ui/Text';
import BottomSheetManager from '@/shared/ui/BottomSheet/BottomSheetManager';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { useDaysPosts } from '@/shared/hooks/useDaysPosts';
import { useDailyFirstLogin } from '@/shared/hooks/useDailyFirstLogin';
import { SPACING } from '@/shared/constants';
import { sendToAI } from '@/shared/api/AIActions';
import { RootStackParamList } from '@/navigation/types';
import { useUserStore } from '@/entities/user/store/userStore';
import { useLentStore } from '@/entities/lent/store/store';
import { weekAnalysisPrompt } from '@/entities/assiatent/promts';
import ModelSelector, { getModelDisplayName } from '@/entities/ai/ModelSelector';
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
  const { checkIns } = useDaysPosts(4);
  const { addCustomPost } = useLentStore();
  const user = useUser();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { ai_tokens, selectedAIModel, minusAiToken } = useUserStore();
  const insets = useSafeAreaInsets();
  const [loadingStates, setLoadingStates] = React.useState<Record<string, boolean>>({
    '1': false, // Анализ недели
    '2': false, // Задать вопрос
    '3': false, // Составить плейлист
    '4': false, // Придумать планы
  });

  const checkAiTokens = () => {
    if (ai_tokens <= 0) {
      Alert.alert('У вас закончились токены(');
      return false;
    }
    return true;
  };

  const setLoadingState = (id: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: isLoading,
    }));
  };

  const handleWeekAnalysis = async () => {
    if (!checkAiTokens()) {
      return;
    }

    try {
      setLoadingState('1', true);
      const prompt = weekAnalysisPrompt(checkIns, user.userData || {});
      const aiResponseID = await sendToAI(prompt);

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
      Alert.alert('Ошибка', 'Не удалось выполнить анализ. Попробуйте позже.');
    } finally {
      setLoadingState('1', false);
    }
  };

  const handleAskQuestion = () => {
    // Просто переходим на страницу для задания вопроса AI
    navigation.navigate('AiQuestionPage');
  };

  const handleCreatePlaylist = () => {
    navigation.navigate('AiPlayListPage');
  };

  const handleCreatePlans = async () => {
    if (!checkAiTokens()) {
      return;
    }

    try {
      setLoadingState('4', true);
      navigation.navigate('AiPlans');
    } catch {
      Alert.alert('Ошибка', 'Не удалось перейти к созданию планов.');
    } finally {
      setLoadingState('4', false);
    }
  };

  const aiBlocks: AIBlock[] = [
    {
      id: '1',
      title: 'Анализ недели',
      description:
        'Расскажем нейросети о твоей неделе — и вернём вдохновляющие советы, которые помогут почувствовать себя лучше 💛',
      action: handleWeekAnalysis,
    },
    {
      id: '2',
      title: 'Задать вопрос',
      description:
        'Спроси что угодно у нашего AI-психолога — и получи тёплый, персональный совет на основе твоих записей 🪄',
      action: handleAskQuestion,
    },
    {
      id: '3',
      title: 'Составить плейлист',
      description: 'Составим плейлист на основе твоих записей и предпочтений 🎵',
      action: handleCreatePlaylist,
    },
    {
      id: '4',
      title: 'Придумать планы',
      description:
        'Отправим нейросети контекст твоей жизни и пожелания взамен получим подборку идей на неделю/выходные/вечер 📝',
      action: handleCreatePlans,
    },
  ];

  const renderAIBlock = ({ item }: { item: AIBlock }) => {
    const isLoading = loadingStates[item.id];
    const isDisabled = false;

    // Иконки для разных типов карточек
    let icon;
    switch (item.id) {
      case '1':
        icon = <Icon color={colors.PRIMARY} name='analytics-outline' size={24} />;
        break;
      case '2':
        icon = <Icon color={colors.PRIMARY} name='chatbubble-outline' size={24} />;
        break;
      case '3':
        icon = <Icon color={colors.PRIMARY} name='musical-notes-outline' size={24} />;
        break;
      case '4':
        icon = <Icon color={colors.PRIMARY} name='calendar-outline' size={24} />;
        break;
    }

    return (
      <AICard
        description={item.description}
        disabled={isDisabled}
        icon={icon}
        isLoading={isLoading}
        title={item.title}
        onPress={item.action}
      />
    );
  };

  const showModelSelector = () => {
    BottomSheetManager.show(<ModelSelector />, {
      snapPoints: ['50%'],
      topInset: insets.top,
      bottomInset: insets.bottom,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle} variant='h2'>
        AI Помощник
      </Text>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={aiBlocks}
        keyExtractor={(item) => item.id}
        ListFooterComponent={<View style={styles.footerSpace} />}
        ListHeaderComponent={
          <View style={{ marginBottom: SPACING.LARGE }}>
            <View style={styles.headerRow}>
              <Text style={{ color: colors.PRIMARY }} variant='h3'>
                {ai_tokens} <Icon color={colors.PRIMARY} name='star' size={18} />
              </Text>

              <TouchableOpacity style={styles.modelSelector} onPress={showModelSelector}>
                <Text style={styles.modelSelectorText}>
                  Модель: {getModelDisplayName(selectedAIModel)}
                </Text>
                <Icon color={colors.PRIMARY} name='chevron-down' size={16} />
              </TouchableOpacity>
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
    footerSpace: {
      height: 100,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.LARGE,
    },
    modelSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.BACKGROUND_SECONDARY,
      paddingHorizontal: SPACING.MEDIUM,
      paddingVertical: SPACING.SMALL,
      borderRadius: 8,
    },
    modelSelectorText: {
      color: colors.PRIMARY,
      marginRight: SPACING.SMALL,
      fontSize: 14,
    },
  });

export default AIPage;
