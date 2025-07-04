import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';
import React, { useState } from 'react';

import Text from '@/shared/ui/Text/Text';
import { typography } from '@/shared/theme/typography';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

const Input = ({ label, error, style, ...props }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <View>
      {label && (
        <Text color='primary' style={styles.label} variant='body1'>
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={colors.TEXT_PRIMARY}
        style={[styles.input, error && styles.inputError, isFocused && styles.inputFocused, style]}
        onBlur={handleBlur}
        onFocus={handleFocus}
        {...props}
      />
      {error && (
        <Text color='textPrimary' style={styles.error} variant='body2'>
          {error}
        </Text>
      )}
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    label: {
      marginBottom: 8,
    },
    input: {
      height: 56,
      borderWidth: 1,
      borderColor: colors.TEXT_PRIMARY,
      borderRadius: 12,
      paddingHorizontal: 16,
      ...typography.body1,
      color: colors.TEXT_PRIMARY,
    },
    inputFocused: {
      borderColor: colors.PRIMARY,
    },
    inputError: {
      borderColor: '#FF3B30',
    },
    error: {
      marginTop: 4,
      color: '#FF3B30',
    },
  });

export default Input;
