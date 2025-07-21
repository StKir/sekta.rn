import { View, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

import Text from '@/shared/ui/Text/Text';
import { typography } from '@/shared/theme/typography';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';

type SelectorOption<T = string> = {
  value: T;
  label: string;
};

type SelectorProps<T = string> = {
  label?: string;
  value: T | T[] | null;
  onChange: (value: T | T[]) => void;
  options: Array<SelectorOption<T>>;
  multiSelect?: boolean;
  disabled?: boolean;
  labelStyle?: TextStyle;
  buttonStyle?: (option: SelectorOption<T>, isSelected: boolean) => ViewStyle;
  buttonTextStyle?: TextStyle;
};

const Selector = <T extends string | number>({
  label,
  value,
  onChange,
  options,
  multiSelect = false,
  labelStyle,
  disabled = false,
  buttonStyle,
  buttonTextStyle,
}: SelectorProps<T>) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handlePress = (optionValue: T) => {
    if (disabled) {
      return;
    }

    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter((v) => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
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
        <Text color='primary' style={[styles.label, labelStyle]} variant='body1'>
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
              buttonStyle?.(option, isSelected(option.value)),
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
                labelStyle,
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
      borderColor: colors.TEXT_SECONDARY,
      borderRadius: 12,
      justifyContent: 'center',
    },
    buttonActive: {
      backgroundColor: colors.PRIMARY,
      borderColor: colors.PRIMARY,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      ...typography.body1,
      color: colors.TEXT_SECONDARY,
    },
    buttonTextActive: {
      color: colors.BACKGROUND_PRIMARY,
    },
    buttonTextDisabled: {
      color: colors.TEXT_PRIMARY,
      opacity: 0.5,
    },
  });

export default Selector;
