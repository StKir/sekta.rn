import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';
import React, { useState } from 'react';

import Text from '@/shared/ui/Text/Text';
import { typography } from '@/shared/theme/typography';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';

type TextAreaProps = TextInputProps & {
  label?: string;
  error?: string;
  minHeight?: number;
};

const TextArea = ({ label, error, style, minHeight = 120, ...props }: TextAreaProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useTheme();
  const styles = createStyles(colors, minHeight);

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
        multiline
        placeholderTextColor={colors.TEXT_PRIMARY}
        style={[
          styles.textArea,
          error && styles.textAreaError,
          isFocused && styles.textAreaFocused,
          style,
        ]}
        textAlignVertical='top'
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

const createStyles = (colors: ThemeColors, minHeight: number) =>
  StyleSheet.create({
    label: {
      marginBottom: 8,
    },
    textArea: {
      minHeight,
      borderWidth: 1,
      borderColor: colors.TEXT_PRIMARY,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      ...typography.body1,
      color: colors.TEXT_PRIMARY,
    },
    textAreaFocused: {
      borderColor: colors.PRIMARY,
    },
    textAreaError: {
      borderColor: '#FF3B30',
    },
    error: {
      marginTop: 4,
      color: '#FF3B30',
    },
  });

export default TextArea;
