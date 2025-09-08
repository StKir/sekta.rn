import { View } from 'react-native';
import React from 'react';

import PointerLine from '@/shared/ui/PointerLine/PointerLine';
import Day from '@/shared/ui/Day/Day';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { SPACING } from '@/shared/constants';

type DayHeaderProps = {
  date: Date | string;
  dayId: string;
};

const DayHeader = ({ date }: DayHeaderProps) => {
  return (
    <View>
      <MainContainer alignItems='flex-end' flexDirection='row' justifyContent='space-between'>
        <Day date={new Date(date)} />
      </MainContainer>
      <PointerLine offsetTop={SPACING.MEDIUM} />
    </View>
  );
};

export default DayHeader;
