import { View } from 'react-native';
import React from 'react';

import Tag from '@/shared/ui/Tag/Tag';
import MainContainer from '@/shared/ui/Container/MainContainer';

type TagListLentProps = {
  tags: string[];
  variant?: 'normal' | 'small';
};

const TagListLent = ({ tags, variant = 'normal' }: TagListLentProps) => {
  return (
    <MainContainer>
      <View style={{ gap: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <Tag key={tag} text={tag} variant={variant} />
        ))}
      </View>
    </MainContainer>
  );
};

export default TagListLent;
