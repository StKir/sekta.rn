import { View } from 'react-native';
import React from 'react';

import Title from '../Title';

import { useTheme } from '@/shared/theme';
import { SIZES, SPACING } from '@/shared/constants';

type TimeTitleProps = {
  date: Date;
};

const TimeTitle = ({ date }: TimeTitleProps) => {
  const { colors } = useTheme();

  const getTimeEmoji = (hours: number) => {
    if (hours >= 5 && hours < 12) {
      return '🌅';
    }
    if (hours >= 12 && hours < 17) {
      return '☀️';
    }
    if (hours >= 17 && hours < 22) {
      return '🌆';
    }
    return '🌙';
  };

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeEmoji = getTimeEmoji(hours);

  return (
    <View>
      <Title
        color={colors.TEXT_PRIMARY}
        fontSize={SIZES.FONT_SIZE.XLARGE}
        fontWeight={SIZES.FONT_WEIGHT.REGULAR}
        marginBottom={SPACING.MEDIUM}
      >
        {`${timeEmoji} ${hours}:${minutes}`}
      </Title>
    </View>
  );
};

export default TimeTitle;
