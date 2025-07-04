import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, View } from 'react-native';
import React from 'react';

import PointerLine from '@/shared/ui/PointerLine/PointerLine';
import Day from '@/shared/ui/Day/Day';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { useTheme } from '@/shared/theme';
import { SIZES, SPACING } from '@/shared/constants';

type DayHeaderProps = {
  date: Date;
  dayId: string;
};

const DayHeader = ({ date, dayId }: DayHeaderProps) => {
  const { colors } = useTheme();

  return (
    <View>
      <MainContainer alignItems='flex-end' flexDirection='row' justifyContent='space-between'>
        <Day date={date} />
        <TouchableOpacity
          style={{
            width: SIZES.ICON_SIZE_SMALL,
            height: SIZES.ICON_SIZE_SMALL,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.TEXT_PRIMARY,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons color='black' name='share-social-outline' size={16} />
        </TouchableOpacity>
      </MainContainer>
      <PointerLine offsetBottom={SPACING.LARGE} offsetTop={SPACING.MEDIUM} />
    </View>
  );
};

export default DayHeader;
