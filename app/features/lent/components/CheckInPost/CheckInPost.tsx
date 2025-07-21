import { View } from 'react-native';
import React from 'react';

import { CheckInPost as CheckInPostType } from '@/types/lentTypes';
import TimeTitle from '@/shared/ui/TimeTitle/TimeTitle';
import Share from '@/shared/ui/Share/Share';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { SPACING } from '@/shared/constants';
import TextLent from '@/entities/lent/ui/TextLent/TextLent';
import TagListLent from '@/entities/lent/ui/TagListLent/TagListLent';
import MoodCardLent from '@/entities/lent/ui/MoodCardLent/MoodCardLent';
import MediaLent from '@/entities/lent/ui/MediaLent/MediaLent';

type CheckInPostProps = {
  post: CheckInPostType;
};

const CheckInPost = ({ post }: CheckInPostProps) => {
  const { mood, color, quote, note, media, activities, emotions } = post.data;

  return (
    <Share message='Посмотри на мой пост в приложении!' title='Мой пост'>
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
        {media && <MediaLent media={media} />}
        {quote && <TextLent text={quote} type='quote' />}
        {note && <TextLent text={note} type='text' />}
        {activities.length > 0 && <TagListLent tags={activities} />}
        {emotions.length > 0 && <TagListLent tags={emotions} />}
      </View>
    </Share>
  );
};

export default CheckInPost;
