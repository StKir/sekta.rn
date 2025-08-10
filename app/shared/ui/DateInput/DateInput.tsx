import DatePicker from 'react-native-date-picker';
import { View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import { DateInputProps } from './types';
import { createStyles } from './styles';
import {
  DATE_INPUT_CONSTANTS,
  DATE_FORMATS,
  PLACEHOLDERS,
  TITLES,
  BUTTON_TEXTS,
} from './constants';

import Text from '@/shared/ui/Text/Text';
import { useTheme } from '@/shared/theme';

const DateInput = ({
  label,
  error,
  value,
  onChange,
  type = 'date',
  placeholder = PLACEHOLDERS.DATE,
  style,
}: DateInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handlePress = () => {
    setIsOpen(true);
  };

  const handleConfirm = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const formatValue = () => {
    if (!value) {
      return '';
    }

    if (type === 'time') {
      return value.toLocaleTimeString('ru-RU', DATE_FORMATS.TIME);
    }

    return value.toLocaleDateString('ru-RU', DATE_FORMATS.DATE);
  };

  const getDatePickerMode = () => {
    return type === 'time' ? 'time' : 'date';
  };

  return (
    <View>
      {label && (
        <Text color={colors.PRIMARY} style={styles.label} variant='body1'>
          {label}
        </Text>
      )}
      <TouchableOpacity
        activeOpacity={DATE_INPUT_CONSTANTS.ACTIVE_OPACITY}
        style={[styles.input, error && styles.inputError, style]}
        onPress={handlePress}
      >
        <Text
          color={value ? colors.TEXT_PRIMARY : colors.TEXT_SECONDARY}
          style={styles.inputText}
          variant='body1'
        >
          {value ? formatValue() : placeholder}
        </Text>
      </TouchableOpacity>
      {error && (
        <Text color={colors.TEXT_PRIMARY} style={styles.error} variant='body2'>
          {error}
        </Text>
      )}

      <DatePicker
        modal
        cancelText={BUTTON_TEXTS.CANCEL}
        confirmText={BUTTON_TEXTS.CONFIRM}
        date={value || new Date()}
        locale='ru'
        mode={getDatePickerMode()}
        open={isOpen}
        title={type === 'time' ? TITLES.TIME : TITLES.DATE}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

export default DateInput;
