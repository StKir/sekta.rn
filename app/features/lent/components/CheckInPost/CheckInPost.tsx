import { View } from 'react-native';
import React from 'react';

import { CheckInPost as CheckInPostType } from '@/types/lentTypes';
import TimeTitle from '@/shared/ui/TimeTitle/TimeTitle';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';
import TextLent from '@/entities/lent/ui/TextLent/TextLent';
import TagListLent from '@/entities/lent/ui/TagListLent/TagListLent';
import Stats from '@/entities/lent/ui/Stats/Stats';
import MoodCardLent from '@/entities/lent/ui/MoodCardLent/MoodCardLent';
import MediaLent from '@/entities/lent/ui/MediaLent/MediaLent';

type CheckInPostProps = {
  post: CheckInPostType;
};

const CheckInPost = ({ post }: CheckInPostProps) => {
  const { mood, color, quote, note, media, activities, emotions, power, stress } = post.data;
  const { date } = post;
  const { colors } = useTheme();

  return (
    <View
      style={{
        gap: SPACING.LARGE_2,
        borderRadius: 14,
        backgroundColor: colors.BACKGROUND_SECONDARY,
        paddingVertical: SPACING.LARGE,
      }}
    >
      <MainContainer>
        <TimeTitle date={date} />
      </MainContainer>

      <MoodCardLent color={color?.color} colorText={color?.name} mood={mood} />

      <MediaLent media={media} />
      {quote && <TextLent text={quote} type='quote' />}
      {note && <TextLent text={note} type='text' />}
      <Stats power={power} stress={stress} />
      {activities?.length > 0 && <TagListLent tags={activities} variant='small' />}
      {emotions?.length > 0 && <TagListLent tags={emotions} variant='small' />}
    </View>
  );
};

export default React.memo(CheckInPost);
