import { View } from 'react-native';
import React from 'react';

import { styles } from './Stats.styles';

import Text from '@/shared/ui/Text';
import { useTheme } from '@/shared/theme';

type StatsProps = {
  locked?: boolean;
  power?: number;
  stress?: number;
};

const Stats = ({ locked, power, stress }: StatsProps) => {
  const { colors } = useTheme();
  const style = styles(colors);

  const getWidth = () => {
    const numStress = stress || 0;
    const numPower = power || 0;

    if (stress === power) {
      return {
        stress: { width: '50%' as const },
        power: { width: '50%' as const },
      };
    }

    if (numStress > numPower) {
      return {
        stress: {
          width: '68%' as const,
        },
        power: { width: '30%' as const },
      };
    }
    if (numStress < numPower) {
      return {
        stress: {
          width: '30%' as const,
        },
        power: { width: '68%' as const },
      };
    }
  };

  if (locked) {
    return (
      <View style={style.container}>
        <View style={[style.power_background, style.lockedStat]}>
          <Text style={style.power_color}>Силы</Text>
          <Text style={[style.text, style.power_color]}>—</Text>
        </View>
        <View style={[style.stress_background, style.lockedStat]}>
          <Text style={style.stress_color}>Стресс</Text>
          <Text style={[style.text, style.stress_color]}>—</Text>
        </View>
      </View>
    );
  }

  const width = getWidth();

  return (
    <View style={style.container}>
      {power ? (
        <View
          style={[
            style.stat,
            width?.power,
            style.power_background,
            !stress ? style.statFullWidth : null,
          ]}
        >
          <Text style={style.power_color}>Силы</Text>
          <Text style={[style.text, style.power_color]}>{power}%</Text>
        </View>
      ) : null}
      {stress ? (
        <View
          style={[
            style.stat,
            width?.stress,
            style.stress_background,
            !power ? style.statFullWidth : null,
          ]}
        >
          <Text style={style.stress_color}>Стресс</Text>
          <Text style={[style.text, style.stress_color]}>{stress}%</Text>
        </View>
      ) : null}
    </View>
  );
};

export default Stats;
