import { View, StyleSheet } from 'react-native';
import React from 'react';
import Slider from '@react-native-community/slider';

import Text from '@/shared/ui/Text/Text';
import { useTheme } from '@/shared/theme';

type RangeProps = {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  color?: string;
  max?: number;
  step?: number;
  showValue?: boolean;
};

const Range = ({
  label,
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  color,
  showValue = true,
}: RangeProps) => {
  const { colors } = useTheme();

  const handleValueChange = (newValue: number) => {
    onChange(Math.round(newValue));
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text color='primary' style={styles.label} variant='body1'>
          {label}
        </Text>
      )}

      <Slider
        maximumTrackTintColor={colors.TEXT_SECONDARY + '60'}
        maximumValue={max}
        minimumTrackTintColor={color || colors.PRIMARY}
        minimumValue={min}
        step={step}
        style={styles.slider}
        thumbTintColor={color || colors.PRIMARY}
        value={value}
        onValueChange={handleValueChange}
      />

      <View style={styles.valueContainer}>
        <Text color='textSecondary' variant='body2'>
          {min}
        </Text>
        {showValue && (
          <View style={[styles.valueBadge, { backgroundColor: color || colors.PRIMARY }]}>
            <Text color='white' style={styles.valueText} variant='body2'>
              {value}
            </Text>
          </View>
        )}
        <Text color='textSecondary' variant='body2'>
          {max}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 16,
  },

  slider: {
    width: '100%',
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  valueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 40,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  valueText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Range;
