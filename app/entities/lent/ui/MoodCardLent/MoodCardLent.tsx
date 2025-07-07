/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import React from 'react';

import Title from '@/shared/ui/Title';
import Text from '@/shared/ui/Text';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { useTheme } from '@/shared/theme';

type MoodCardLentProps = {
  color?: string;
  mood: string;
  colorText?: string;
};

const MoodCardLent = ({ color, mood, colorText }: MoodCardLentProps) => {
  const { colors } = useTheme();
  return (
    <MainContainer>
      <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <View
          style={{
            backgroundColor: color,
            width: 140,
            height: 86,
            borderRadius: 25,
            borderTopLeftRadius: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Title fontSize={48}>{mood.slice(0, 2)}</Title>
        </View>
        <View style={{ maxWidth: 135 }}>
          <Text.Body1 color={colors.TEXT_PRIMARY}>{colorText}</Text.Body1>
        </View>
      </View>
    </MainContainer>
  );
};

export default MoodCardLent;
