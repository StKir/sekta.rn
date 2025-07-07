import { View } from 'react-native';
import React from 'react';

import { CheckInPost as CheckInPostType } from '@/types/lentTypes';
import TimeTitle from '@/shared/ui/TimeTitle/TimeTitle';
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
        paddingBottom: SPACING.LARGE_2,
      }}
    >
      <TimeTitle date={post.date} />
      <MoodCardLent color={color?.color} colorText={color?.name} mood={mood} />
      <PhotoLent photoUrl='https://avatars.mds.yandex.net/get-mpic/11532558/2a0000018b43788a1a1069b6cb1d6a50f47a/orig' />
      {quote && <TextLent text={quote} type='quote' />}
      {note && <TextLent text={note} type='text' />}
      {activities.length > 0 && <TagListLent tags={activities} />}
      {emotions.length > 0 && <TagListLent tags={emotions} />}
    </View>
  );
};

export default CheckInPost;
