import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { PostData } from '@/types/lentTypes';
import { AIModelResponseFormat } from '@/types/aiTypes';
import Text from '@/shared/ui/Text';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { SPACING } from '@/shared/constants';
import { sendToAI } from '@/shared/api/AIActions';
import { RootStackParamList } from '@/navigation/types';
import { useLentStore } from '@/entities/lent/store/store';
import { aiCheckPrompt } from '@/entities/assiatent/promts';

const AiCheck = ({ post }: { post: PostData }) => {
  const { colors } = useTheme();
  const { addAiData, aiData } = useLentStore();
  const [isLoading, setIsLoading] = useState(false);

  const findAiCheckResult = useCallback(() => {
    return (
      aiData.find((item) => {
        return String(item.postId) === String(post?.id);
      }) || null
    );
  }, [aiData, post?.id]);

  const user = useUser().userData;
  const checkSubscription = useUser().checkSubscription;

  const styles = createStyles(colors);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const onAiCheck = async () => {
    setIsLoading(true);

    try {
      if (findAiCheckResult()?.postId === String(post?.id)) {
        navigation.navigate('AIResultCheckPage', {
          requestId: String(findAiCheckResult()?.requestId),
        });
        return;
      }

      const postId = post?.id;
      if (!postId) {
        return;
      }

      const hasAccess = await checkSubscription();
      if (!hasAccess) {
        return;
      }
      const prompt = aiCheckPrompt(user, post);
      const aiResponseID = await sendToAI(prompt, AIModelResponseFormat.JSON);

      if (typeof aiResponseID === 'number') {
        addAiData({
          postId: String(postId),
          requestId: aiResponseID,
          status: 'processing',
          result: null,
        });
      }
    } catch {
      console.log('Произошла ошибка(');
    } finally {
      setIsLoading(false);
    }
  };

  const content = useMemo(() => {
    if (isLoading) {
      return <ActivityIndicator color={colors.BACKGROUND_SECONDARY} size='small' />;
    }

    return (
      <Text color='white' variant='body2'>
        {findAiCheckResult() ? 'Смотреть' : '✨AI'}
      </Text>
    );
  }, [colors.BACKGROUND_SECONDARY, findAiCheckResult, isLoading]);

  return (
    <TouchableOpacity onPress={onAiCheck}>
      <View style={styles.container}>{content}</View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingVertical: SPACING.SMALL,
      paddingHorizontal: SPACING.LARGE,
      borderRadius: 14,
      backgroundColor: colors.PRIMARY,
    },
  });

export default AiCheck;
