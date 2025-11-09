/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import React from 'react';

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
          style={
            colorText
              ? {
                  backgroundColor: color,
                  width: 170,
                  height: 90,
                  borderRadius: 25,
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              : {}
          }
        >
          <Text allowFontScaling={true} style={{ fontSize: 50, lineHeight: 62 }}>
            {mood?.slice(0, 2)}
          </Text>
        </View>
        <View style={{ maxWidth: 135 }}>
          <Text.Body1 color={colors.TEXT_PRIMARY}>{mood?.slice(2, 100)}</Text.Body1>
        </View>
      </View>
    </MainContainer>
  );
};

export default MoodCardLent;
