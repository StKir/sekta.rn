import { Dimensions, View } from 'react-native';
import React from 'react';

import { MomentInPost } from '@/types/lentTypes';
import Title from '@/shared/ui/Title';
import TimeTitle from '@/shared/ui/TimeTitle/TimeTitle';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';
import TextLent from '@/entities/lent/ui/TextLent/TextLent';
import TagListLent from '@/entities/lent/ui/TagListLent/TagListLent';
import MediaLent from '@/entities/lent/ui/MediaLent/MediaLent';

type MomentPostProps = {
  post: MomentInPost;
};

const MomentPost = ({ post }: MomentPostProps) => {
  const { note, media, emotions, name } = post.data;
  const { date } = post;
  const { colors } = useTheme();

  return (
    <View
      style={{
        gap: SPACING.LARGE_2,
        borderRadius: 14,
        backgroundColor: colors.BACKGROUND_SECONDARY,
        paddingVertical: SPACING.LARGE,
        position: 'relative',
      }}
    >
      <MainContainer>
        <TimeTitle date={date} />
      </MainContainer>
      <View style={{}}>
        {name && (
          <MainContainer>
            <Title>{name}</Title>
          </MainContainer>
        )}
        {note && <TextLent text={note} type='text' />}
        {emotions && !media && emotions?.length > 0 && (
          <TagListLent tags={emotions} variant='small' />
        )}
      </View>
      {media && (
        <View>
          <MediaLent
            containerStyle={{ height: Dimensions.get('screen').height - 300 }}
            media={media}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 12,
              width: '100%',
              backgroundColor: colors.BACKGROUND_PRIMARY,
              opacity: 0.7,
              paddingVertical: 20,
              paddingHorizontal: 20,
            }}
          >
            {emotions && emotions?.length > 0 && <TagListLent tags={emotions} variant='small' />}
          </View>
        </View>
      )}
    </View>
  );
};

export default React.memo(MomentPost);
