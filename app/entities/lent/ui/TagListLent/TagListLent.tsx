import { View } from 'react-native';
import React from 'react';

import Tag from '@/shared/ui/Tag/Tag';
import MainContainer from '@/shared/ui/Container/MainContainer';

type TagListLentProps = {
  tags: string[];
};

const TagListLent = ({ tags }: TagListLentProps) => {
  return (
    <MainContainer>
      <View style={{ gap: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <Tag key={tag} text={tag} />
        ))}
      </View>
    </MainContainer>
  );
};

export default TagListLent;
