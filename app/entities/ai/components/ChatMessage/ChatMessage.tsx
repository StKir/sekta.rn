import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

import { ChatMessage as ChatMessageType } from '../../store/chatStore';

import Text from '@/shared/ui/Text';
import { FormattedText } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';

type ChatMessageProps = {
  message: ChatMessageType;
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const isUser = message.role === 'user';
  const text = message.content[0]?.text || '';
  const isProcessing = message.status === 'processing';
  const showCopyButton = !isUser && !isProcessing && text.trim().length > 0;

  const handleCopy = () => {
    Clipboard.setString(text);
  };

  return (
    <>
      <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
        {!isUser && (
          <View style={styles.assistantMessageWrapper}>
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              {isProcessing ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color={colors.PRIMARY} size='small' />
                  <Text style={[styles.messageText, styles.assistantText]}>Ожидание ответа...</Text>
                </View>
              ) : (
                <FormattedText>{text || ' '}</FormattedText>
              )}
            </View>
          </View>
        )}
        {showCopyButton && (
          <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
            <Icon color={colors.TEXT_SECONDARY} name='copy-outline' size={18} />
          </TouchableOpacity>
        )}
        {isUser && (
          <View style={[styles.messageBubble, styles.userBubble]}>
            <Text style={[styles.messageText, styles.userText]}>{text || ' '}</Text>
          </View>
        )}
      </View>
    </>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: SPACING.LARGE,
      width: '100%',
    },
    userContainer: {
      alignItems: 'flex-end',
    },
    assistantContainer: {
      alignItems: 'flex-start',
    },
    assistantMessageWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%',
    },
    messageBubble: {
      paddingHorizontal: SPACING.LARGE,
      paddingVertical: SPACING.MEDIUM,
      borderRadius: 16,
    },
    userBubble: {
      backgroundColor: colors.PRIMARY,
      borderBottomRightRadius: 4,
      maxWidth: '80%',
    },
    assistantBubble: {
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderBottomLeftRadius: 4,
      flex: 1,
      marginRight: SPACING.SMALL,
    },
    messageText: {
      fontSize: 16,
      lineHeight: 24,
    },
    userText: {
      color: '#FFFFFF',
    },
    assistantText: {
      color: colors.TEXT_PRIMARY,
    },
    copyButton: {
      padding: SPACING.SMALL,
      marginTop: SPACING.SMALL,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.SMALL,
    },
  });

export default ChatMessage;
