import { View, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import React from 'react';

import { typography } from '@/theme/typography';
import { colors } from '@/theme/colors';
import Text from '@/shared/components/Text/Text';

type SelectorOption<T = string> = {
  value: T;
  label: string;
};

type SelectorProps<T = string> = {
  label?: string;
  value: T | null;
  onChange: (value: T) => void;
  options: Array<SelectorOption<T>>;
  multiSelect?: boolean;
  disabled?: boolean;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
};

const Selector = <T extends string | number>({
  label,
  value,
  onChange,
  options,
  multiSelect = false,
  disabled = false,
  buttonStyle,
  buttonTextStyle,
}: SelectorProps<T>) => {
  const handlePress = (optionValue: T) => {
    if (disabled) {
      return;
    }

    if (multiSelect) {
      onChange(optionValue);
    } else {
      onChange(optionValue);
    }
  };

  const isSelected = (optionValue: T) => {
    if (multiSelect && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <View>
      {label && (
        <Text color='primary' style={styles.label} variant='body1'>
          {label}
        </Text>
      )}
      <View style={styles.buttonsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            disabled={disabled}
            key={String(option.value)}
            style={[
              styles.button,
              buttonStyle,
              isSelected(option.value) && styles.buttonActive,
              disabled && styles.buttonDisabled,
            ]}
            onPress={() => handlePress(option.value)}
          >
            <Text
              style={[
                styles.buttonText,
                buttonTextStyle,
                isSelected(option.value) && styles.buttonTextActive,
                disabled && styles.buttonTextDisabled,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 32,
  },
  label: {
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.button.default,
    borderRadius: 12,
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.body1,
    color: colors.button.default,
  },
  buttonTextActive: {
    color: colors.white,
  },
  buttonTextDisabled: {
    color: colors.textPrimary,
    opacity: 0.5,
  },
});

export default Selector;
