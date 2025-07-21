import { View } from 'react-native';
import React from 'react';

import { CheckInPost as CheckInPostType } from '@/types/lentTypes';
import TimeTitle from '@/shared/ui/TimeTitle/TimeTitle';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { SPACING } from '@/shared/constants';
import TextLent from '@/entities/lent/ui/TextLent/TextLent';
import TagListLent from '@/entities/lent/ui/TagListLent/TagListLent';
import PhotoLent from '@/entities/lent/ui/PhotoLent/PhotoLent';
import MoodCardLent from '@/entities/lent/ui/MoodCardLent/MoodCardLent';

type CheckInPostProps = {
  post: CheckInPostType;
};

const CheckInPost = ({ post }: CheckInPostProps) => {
  const { mood, color, quote, note, media, activities, emotions } = post.data;

  return (
    <View
      style={{
        gap: SPACING.LARGE,
        paddingBottom: SPACING.LARGE,
      }}
    >
      <MainContainer>
        <TimeTitle date={post.date} />
      </MainContainer>
      <MoodCardLent color={color?.color} colorText={color?.name} mood={mood} />
      {media && <PhotoLent photoUrl={media[0].uri} />}
      {quote && <TextLent text={quote} type='quote' />}
      {note && <TextLent text={note} type='text' />}
      {activities.length > 0 && <TagListLent tags={activities} />}
      {emotions.length > 0 && <TagListLent tags={emotions} />}
    </View>
  );
};

export default CheckInPost;
