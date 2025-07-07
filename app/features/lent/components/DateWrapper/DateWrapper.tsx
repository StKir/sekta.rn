import { View } from 'react-native';
import React from 'react';

import { SPACING } from '@/shared/constants';
import DayHeader from '@/entities/lent/ui/DayHeader/DayHeader';

type DateWrapperProps = {
  date: string;
} & React.PropsWithChildren;

const DateWrapper = ({ children, date }: DateWrapperProps) => {
  return (
    <>
      <DayHeader date={date} dayId={date} />
      <View style={{ gap: SPACING.LARGE_2 }}>{children}</View>
    </>
  );
};

export default DateWrapper;
