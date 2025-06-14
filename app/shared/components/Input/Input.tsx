import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';
import React, { useState } from 'react';

import { typography } from '@/theme/typography';
import { colors } from '@/theme/colors';
import Text from '@/shared/components/Text/Text';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

const Input = ({ label, error, style, ...props }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

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
        placeholderTextColor={colors.textPrimary}
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

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.textPrimary,
    borderRadius: 12,
    paddingHorizontal: 16,
    ...typography.body1,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.primary,
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
