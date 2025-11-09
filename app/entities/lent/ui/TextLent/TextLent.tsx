import React from 'react';

import Title from '@/shared/ui/Title';
import Text from '@/shared/ui/Text';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { useTheme } from '@/shared/theme';
import { SIZES } from '@/shared/constants';

type TextLentProps = {
  text: string;
  type: 'quote' | 'text';
};

const TextLent = ({ text, type }: TextLentProps) => {
  const { colors } = useTheme();
  if (type === 'quote') {
    return (
      <MainContainer>
        <Title
          color={colors.TEXT_PRIMARY}
          fontSize={SIZES.FONT_SIZE.XXLARGE}
          fontWeight={SIZES.FONT_WEIGHT.REGULAR}
          lineHeight={SIZES.FONT_SIZE.XXLARGE}
        >
          {' '}
          - “{text}”
        </Title>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Text.Body1 color={colors.TEXT_PRIMARY}>{text}</Text.Body1>
    </MainContainer>
  );
};

export default TextLent;
