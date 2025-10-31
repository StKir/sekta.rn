import Icon from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { AIModel } from '@/types/aiTypes';
import { formatDateRange } from '@/shared/utils/date';
import Text from '@/shared/ui/Text';
import { showAIQuestionModal } from '@/shared/ui/AIQuestionModal/showAIQuestionModal';
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
  const { ai_tokens, minusAiToken, selectedAIModel, setSelectedAIModel } = useUserStore();
  const [isModelSelectorVisible, setIsModelSelectorVisible] = useState(false);
  console.log(selectedAIModel);

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
          const aiResponseID = await sendToAI(prompt);

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
          // Пользователь отменил ввод вопроса
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

  const renderModelSelector = () => {
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={isModelSelectorVisible}
        onRequestClose={() => setIsModelSelectorVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle} variant='h3'>
              Выберите модель AI
            </Text>

            <ScrollView style={styles.modelList}>
              {Object.values(AIModel).map((model) => (
                <TouchableOpacity
                  key={model}
                  style={[styles.modelItem, selectedAIModel === model && styles.selectedModelItem]}
                  onPress={() => {
                    setSelectedAIModel(model);
                    setIsModelSelectorVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modelText,
                      selectedAIModel === model && styles.selectedModelText,
                    ]}
                  >
                    {model}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModelSelectorVisible(false)}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const getModelDisplayName = (model: AIModel) => {
    switch (model) {
      case AIModel.GPT_4_1:
        return 'GPT-4';
      case AIModel.GROK_4:
        return 'Grok-4';
      case AIModel.DEEPSEEK_R1:
        return 'DeepSeek';
      case AIModel.CLAUDE_3_7_SONNET:
        return 'Claude 3.7';
      default:
        return model;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle} variant='h2'>
        AI Помощник
      </Text>

      {renderModelSelector()}

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

              <TouchableOpacity
                style={styles.modelSelector}
                onPress={() => setIsModelSelectorVisible(true)}
              >
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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: colors.BACKGROUND_PRIMARY,
      borderRadius: 10,
      padding: SPACING.LARGE,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      marginBottom: SPACING.LARGE,
      color: colors.TEXT_PRIMARY,
    },
    modelList: {
      width: '100%',
      maxHeight: 300,
    },
    modelItem: {
      padding: SPACING.MEDIUM,
      borderBottomWidth: 1,
      borderBottomColor: colors.BORDER,
      width: '100%',
    },
    selectedModelItem: {
      backgroundColor: colors.PRIMARY_LITE,
    },
    modelText: {
      color: colors.TEXT_PRIMARY,
      fontSize: 16,
    },
    selectedModelText: {
      color: colors.PRIMARY,
      fontWeight: 'bold',
    },
    closeButton: {
      marginTop: SPACING.LARGE,
      backgroundColor: colors.PRIMARY,
      paddingVertical: SPACING.MEDIUM,
      paddingHorizontal: SPACING.LARGE,
      borderRadius: 8,
    },
    closeButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
  });

export default AIPage;
