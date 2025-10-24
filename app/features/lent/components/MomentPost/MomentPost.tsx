import { View } from 'react-native';
import React from 'react';

import { MomentInPost } from '@/types/lentTypes';
import Title from '@/shared/ui/Title';
import TimeTitle from '@/shared/ui/TimeTitle/TimeTitle';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { Share } from '@/shared/ui';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';
import TagListLent from '@/entities/lent/ui/TagListLent/TagListLent';
import MediaLent from '@/entities/lent/ui/MediaLent/MediaLent';

type MomentPostProps = {
  post: MomentInPost;
};

const MomentPost = ({ post }: MomentPostProps) => {
  const { media, emotions, name } = post.data;
  const { date } = post;
  const { colors } = useTheme();

  return (
    <Share id={post.id} key={post.id} message='Посмотри на мой пост в приложении!' title='Мой пост'>
      <View
        style={{
          gap: SPACING.MEDIUM,
          borderRadius: 14,
          backgroundColor: colors.BACKGROUND_SECONDARY,
          paddingVertical: SPACING.LARGE,
          position: 'relative',
        }}
      >
        <MainContainer>
          <TimeTitle date={date} />
        </MainContainer>

        {name && (
          <MainContainer>
            <Title marginBottom={0}>{name}</Title>
          </MainContainer>
        )}
        <MediaLent containerStyle={{ height: 500 }} media={media} />
        {emotions && emotions?.length > 0 && <TagListLent tags={emotions} variant='small' />}
      </View>
    </Share>
  );
};

export default React.memo(MomentPost);
