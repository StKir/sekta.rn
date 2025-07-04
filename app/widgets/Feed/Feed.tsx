import { View } from 'react-native';
import React from 'react';

import TimeTitle from '@/shared/ui/TimeTitle/TimeTitle';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { SPACING } from '@/shared/constants';
import TextLent from '@/entities/lent/ui/TextLent/TextLent';
import TagListLent from '@/entities/lent/ui/TagListLent/TagListLent';
import PhotoLent from '@/entities/lent/ui/PhotoLent/PhotoLent';
import MoodCardLent from '@/entities/lent/ui/MoodCardLent/MoodCardLent';
import DayHeader from '@/entities/lent/ui/DayHeader/DayHeader';

const Feed = () => {
  return (
    <View>
      <DayHeader date={new Date()} dayId='1' />
      <MainContainer>
        <TimeTitle date={new Date()} />
      </MainContainer>
      <View style={{ gap: SPACING.LARGE }}>
        <MoodCardLent color='#7700ff' colorText='Загадочная синева' id='1' mood='🥳' />
        <PhotoLent photoUrl='https://avatars.mds.yandex.net/get-mpic/11532558/2a0000018b43788a1a1069b6cb1d6a50f47a/orig' />
        <TextLent text='Я чувствую себя прекрасно' type='quote' />
        <TagListLent tags={['😡 Все бесит', '🧠 Учеба']} />
      </View>
    </View>
  );
};

export default Feed;
