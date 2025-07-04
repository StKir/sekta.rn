import { View } from 'react-native';
import React from 'react';

import Title from '../Title/Title';

import { useTheme } from '@/shared/theme';
import { SIZES } from '@/shared/constants';

type DayProps = {
  date: Date;
};

const Day = ({ date }: DayProps) => {
  const { colors } = useTheme();
  const formattedDay = date.getDate().toString().padStart(2, '0');
  const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  const formattedYear = date.getFullYear().toString();

  return (
    <View>
      <Title
        fontSize={SIZES.FONT_SIZE.XLARGE}
        fontWeight={SIZES.FONT_WEIGHT.REGULAR}
        marginVertical={0}
      >
        {formattedDay}.{formattedMonth}
      </Title>
      <Title
        color={colors.TEXT_SECONDARY}
        fontSize={SIZES.FONT_SIZE.SMALL}
        fontWeight={SIZES.FONT_WEIGHT.REGULAR}
        marginVertical={0}
      >
        {formattedYear}
      </Title>
    </View>
  );
};

export default Day;
