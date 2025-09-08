import { View } from 'react-native';
import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { AIPost } from '@/types/lentTypes';
import Text from '@/shared/ui/Text';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { Button } from '@/shared/ui';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';
import { RootStackParamList } from '@/navigation/types';

interface Props {
  post: AIPost;
}

const AIWeekAnalysisPostComponent = ({ post }: Props) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const currentPost = post;

  return (
    <View
      style={{
        borderRadius: 14,
        backgroundColor: colors.BACKGROUND_SECONDARY,
        paddingVertical: SPACING.LARGE,
      }}
    >
      <MainContainer gap={SPACING.LARGE_2}>
        <Text.H3>{currentPost.title}</Text.H3>
        <Button
          fullWidth
          title='Смотреть'
          variant='outline'
          onPress={() => {
            navigation.navigate('AIResultPage', { requestId: Number(currentPost.id) });
          }}
        />
      </MainContainer>
    </View>
  );
};

export default AIWeekAnalysisPostComponent;
