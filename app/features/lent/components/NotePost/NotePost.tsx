import { View } from 'react-native';
import React from 'react';

import { NotePost as NotePostType } from '@/types/lentTypes';
import Title from '@/shared/ui/Title';
import TimeTitle from '@/shared/ui/TimeTitle/TimeTitle';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';
import TextLent from '@/entities/lent/ui/TextLent/TextLent';
import MediaLent from '@/entities/lent/ui/MediaLent/MediaLent';

type NotePostProps = {
  post: NotePostType;
};

const NotePost = ({ post }: NotePostProps) => {
  const { note, media, name } = post.data;
  const { date } = post;
  const { colors } = useTheme();

  return (
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
      {note && <TextLent text={note} type='text' />}
      <MediaLent
        containerStyle={{ height: 200, flexDirection: 'row', alignItems: 'center' }}
        media={media}
      />
    </View>
  );
};

export default React.memo(NotePost);
