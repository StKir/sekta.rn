import { View } from 'react-native';
import React from 'react';

import { styles } from './Stats.styles';

import Text from '@/shared/ui/Text';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { useTheme } from '@/shared/theme';

type StatsProps = {
  power?: number;
  stress?: number;
};

const Stats = ({ power, stress }: StatsProps) => {
  const { colors } = useTheme();
  const style = styles(colors);

  if (!(stress && power)) {
    return null;
  }

  const getWidth = () => {
    if (!(stress && power)) {
      return {};
    }

    if (stress === power) {
      return {};
    }

    if (stress > power) {
      return {
        stress: {
          width: '68%' as const,
        },
        power: { width: '30%' as const },
      };
    }
    if (stress < power) {
      return {
        stress: {
          width: '30%' as const,
        },
        power: { width: '68%' as const },
      };
    }
  };

  const width = getWidth();

  return (
    <MainContainer>
      <View style={style.container}>
        {power && (
          <View
            style={[style.stat, width?.power, style.power_background, !stress && { width: '100%' }]}
          >
            <Text style={style.power_color}>Cилы</Text>
            <Text style={[style.text, style.power_color]}>{power}%</Text>
          </View>
        )}
        {stress && (
          <View
            style={[
              style.stat,
              width?.stress,
              style.stress_background,
              !power && { width: '100%' },
            ]}
          >
            <Text style={style.stress_color}>Стресс</Text>
            <Text style={[style.text, style.stress_color]}>{stress}%</Text>
          </View>
        )}
      </View>
    </MainContainer>
  );
};

export default Stats;
