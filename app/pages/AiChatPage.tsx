import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import React, { useRef, useEffect } from 'react';

import { calculateAge } from '@/shared/utils/dateUtils';
import Text from '@/shared/ui/Text';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { useSubscription } from '@/shared/hooks/useSubscription';
import { useDaysPosts } from '@/shared/hooks/useDaysPosts';
import { SPACING } from '@/shared/constants';
import { sendChatMessage, pollForResultWithCallback } from '@/shared/api/AIActions';
import { useUserStore } from '@/entities/user/store/userStore';
import { useChatStore, ChatMessage } from '@/entities/ai/store/chatStore';
import ChatMessageComponent from '@/entities/ai/components/ChatMessage';

const AiChatPage = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { minusAiToken } = useUserStore();
  const insets = useSafeAreaInsets();
  const { messages, addMessage, updateMessage, getLastMessages, clearMessages } = useChatStore();
  const { checkSubscription } = useSubscription();
  const user = useUser();
  const [inputText, setInputText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedDays, setSelectedDays] = React.useState<number>(1);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { postsData } = useDaysPosts(selectedDays);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const keyboardWillShow = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardHeight(40);
      });
      const keyboardWillHide = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
      });

      return () => {
        keyboardWillShow.remove();
        keyboardWillHide.remove();
      };
    }
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getContextPrompt = (days: number, contextPosts: any[], userData: any) => {
    JSON.stringify(contextPosts);
    const daysText = days === 1 ? 'день' : days === 3 ? 'дня' : 'дней';
    return `Ты выступаешь в роли профессионального психолога и эмоционального коуча.
Пользователь общается с тобой в чате.

Используй этот контекст, чтобы:
1. Учитывать текущее психологическое состояние пользователя
2. Поддержать, опираясь на внутреннюю динамику человека
3. Давать мягкие рекомендации с учетом контекста

Отвечай дружелюбно и с эмпатией, как хороший психолог, которому можно доверять.

Информация о пользователе:
Имя: ${userData?.name || 'Не указано'}
Пол: ${userData?.gender || 'Не указан'}
Возраст: ${userData?.birthDate ? calculateAge(userData.birthDate) : 'Не указан'}
Стиль общения: ${userData?.communication_style || 'Дружелюбный'}
О себе: ${userData?.about_me || 'Не указано'}

Контекст пользователя за последние ${days} ${daysText}:
${JSON.stringify(contextPosts)}

Теперь пользователь будет задавать вопросы в чате. Отвечай на его вопросы, учитывая предоставленный контекст. отвечай в markdown разметке`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) {
      return;
    }

    setIsLoading(true);
    const messageText = inputText.trim();
    setInputText('');

    const hasAccess = await checkSubscription();
    if (!hasAccess) {
      setIsLoading(false);
      return;
    }

    addMessage({
      role: 'user',
      content: [
        {
          type: 'text',
          text: messageText,
        },
      ],
    });
    scrollToBottom();

    const lastMessages = getLastMessages(6);
    const contextPrompt = getContextPrompt(selectedDays, postsData, user.userData);

    const messagesToSend = [
      {
        role: 'system' as const,
        content: [
          {
            type: 'text' as const,
            text: contextPrompt,
          },
        ],
      },
      ...lastMessages.map((msg: ChatMessage) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: [
          {
            type: 'text' as const,
            text: messageText,
          },
        ],
      },
    ];

    try {
      const requestId = await sendChatMessage(messagesToSend);
      minusAiToken();

      const assistantId = addMessage({
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: '',
          },
        ],
        status: 'processing',
        requestId,
      });

      pollForResultWithCallback(requestId, (status, result) => {
        if (status === 'success' && result) {
          updateMessage(assistantId, {
            status: 'success',
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          });
          setIsLoading(false);
        } else if (status === 'error') {
          updateMessage(assistantId, {
            status: 'error',
            content: [
              {
                type: 'text',
                text: 'Произошла ошибка при получении ответа',
              },
            ],
          });
          setIsLoading(false);
        }
      });
    } catch {
      Alert.alert('Ошибка', 'Не удалось отправить сообщение. Попробуйте позже.');
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    Alert.alert('Новый чат', 'Вы уверены, что хотите начать новый чат?', [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        text: 'Начать',
        style: 'destructive',
        onPress: () => {
          clearMessages();
        },
      },
    ]);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    return <ChatMessageComponent message={item} />;
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.header}>
        <></>
        <Text style={styles.pageTitle} variant='h2'>
          AI Чат
        </Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearChat}>
          <Icon color={colors.TEXT_PRIMARY} name='add-circle-outline' size={24} />
        </TouchableOpacity>
      </View>

      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView
          behavior='padding'
          keyboardVerticalOffset={insets.top}
          style={styles.chatWrapper}
        >
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={messages}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='handled'
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text color='textSecondary' variant='body1'>
                  Начните диалог с AI-помощником
                </Text>
              </View>
            }
            ref={flatListRef}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
          />

          <View style={[styles.inputContainer, { paddingBottom: insets.bottom + SPACING.MEDIUM }]}>
            <View style={styles.daysButtonsContainer}>
              <TouchableOpacity
                style={[styles.dayButton, selectedDays === 1 && styles.dayButtonActive]}
                onPress={() => setSelectedDays(1)}
              >
                <Text
                  style={[styles.dayButtonText, selectedDays === 1 && styles.dayButtonTextActive]}
                >
                  Добаить контекст дня
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dayButton, selectedDays === 3 && styles.dayButtonActive]}
                onPress={() => setSelectedDays(3)}
              >
                <Text
                  style={[styles.dayButtonText, selectedDays === 3 && styles.dayButtonTextActive]}
                >
                  3 дня
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dayButton, selectedDays === 7 && styles.dayButtonActive]}
                onPress={() => setSelectedDays(7)}
              >
                <Text
                  style={[styles.dayButtonText, selectedDays === 7 && styles.dayButtonTextActive]}
                >
                  7 дней
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                multiline
                editable={!isLoading}
                maxLength={500}
                placeholder='Введите сообщение...'
                placeholderTextColor={colors.TEXT_SECONDARY}
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity
                disabled={!inputText.trim() || isLoading}
                style={[
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={handleSendMessage}
              >
                {isLoading ? (
                  <ActivityIndicator color='#FFFFFF' size='small' />
                ) : (
                  <Icon color='#FFFFFF' name='send' size={20} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.chatWrapper}>
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={messages}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='handled'
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text color='textSecondary' variant='body1'>
                  Начните диалог с AI-помощником
                </Text>
              </View>
            }
            ref={flatListRef}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
          />

          <View
            style={[
              styles.inputContainer,
              {
                paddingBottom:
                  keyboardHeight > 0
                    ? keyboardHeight + SPACING.MEDIUM
                    : insets.bottom + SPACING.MEDIUM,
              },
            ]}
          >
            <View style={styles.daysButtonsContainer}>
              <Text variant='body2'>Контекст: </Text>
              <TouchableOpacity
                style={[styles.dayButton, selectedDays === 1 && styles.dayButtonActive]}
                onPress={() => setSelectedDays(1)}
              >
                <Text
                  style={[styles.dayButtonText, selectedDays === 1 && styles.dayButtonTextActive]}
                >
                  1 день
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dayButton, selectedDays === 3 && styles.dayButtonActive]}
                onPress={() => setSelectedDays(3)}
              >
                <Text
                  style={[styles.dayButtonText, selectedDays === 3 && styles.dayButtonTextActive]}
                >
                  3 дня
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dayButton, selectedDays === 7 && styles.dayButtonActive]}
                onPress={() => setSelectedDays(7)}
              >
                <Text
                  style={[styles.dayButtonText, selectedDays === 7 && styles.dayButtonTextActive]}
                >
                  7 дней
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                multiline
                editable={!isLoading}
                maxLength={500}
                placeholder='Введите сообщение...'
                placeholderTextColor={colors.TEXT_SECONDARY}
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity
                disabled={!inputText.trim() || isLoading}
                style={[
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={handleSendMessage}
              >
                {isLoading ? (
                  <ActivityIndicator color='#FFFFFF' size='small' />
                ) : (
                  <Icon color='#FFFFFF' name='send' size={20} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
      paddingBottom: 50,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.LARGE,
      paddingTop: SPACING.MEDIUM,
      paddingBottom: SPACING.MEDIUM,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    chatWrapper: {
      flex: 1,
    },
    backButton: {
      padding: SPACING.SMALL,
    },
    pageTitle: {
      color: colors.TEXT_PRIMARY,
      flex: 1,
      textAlign: 'center',
    },
    placeholder: {
      width: 40,
    },
    clearButton: {
      padding: SPACING.SMALL,
    },
    listContainer: {
      paddingHorizontal: SPACING.LARGE,
      paddingTop: SPACING.MEDIUM,
      paddingBottom: SPACING.LARGE,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.XLARGE,
    },
    inputContainer: {
      paddingHorizontal: SPACING.LARGE,
      paddingTop: SPACING.MEDIUM,
      backgroundColor: colors.BACKGROUND_PRIMARY,
      borderTopWidth: 1,
      borderTopColor: colors.BACKGROUND_SECONDARY,
      position: 'relative',
    },
    daysButtonsContainer: {
      flexDirection: 'row',
      gap: SPACING.SMALL,
      alignItems: 'center',
      marginBottom: SPACING.SMALL,
      justifyContent: 'flex-start',
    },
    dayButton: {
      paddingHorizontal: SPACING.MEDIUM,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderWidth: 1,
      borderColor: colors.TEXT_SECONDARY,
    },
    dayButtonActive: {
      backgroundColor: colors.PRIMARY,
      borderColor: colors.PRIMARY,
    },
    dayButtonText: {
      fontSize: 14,
      color: colors.TEXT_SECONDARY,
    },
    dayButtonTextActive: {
      color: '#FFFFFF',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderRadius: 24,
      paddingHorizontal: SPACING.MEDIUM,
      paddingVertical: SPACING.SMALL,
    },
    input: {
      flex: 1,
      maxHeight: 100,
      fontSize: 15,
      color: colors.TEXT_PRIMARY,
      paddingVertical: SPACING.SMALL,
      paddingRight: SPACING.SMALL,
    },
    sendButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.PRIMARY,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
  });

export default AiChatPage;
