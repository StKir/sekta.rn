import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import React from 'react';

import { typography } from '@/theme/typography';
import { colors } from '@/theme/colors';
import Text from '@/shared/components/Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Button = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) => {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.button];

    if (style) {
      baseStyle.push(style);
    }

    if (variant === 'primary') {
      baseStyle.push(styles.primaryButton);
    }
    if (variant === 'secondary') {
      baseStyle.push(styles.secondaryButton);
    }
    if (variant === 'outline') {
      baseStyle.push(styles.outlineButton);
    }

    if (variant === 'text') {
      if (style) {
        return [styles.textButton, style];
      }

      return [styles.textButton];
    }

    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    return baseStyle;
  };

  const getTextColor = () => {
    if (disabled) {
      return colors.textPrimary;
    }
    if (variant === 'outline') {
      return colors.primary;
    }

    if (variant === 'text') {
      return textStyle?.color || colors.primary;
    }

    return colors.white;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      style={getButtonStyle()}
      onPress={onPress}
    >
      <Text.Button style={[textStyle, { color: getTextColor() }]}>{title}</Text.Button>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.background,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textButton: {
    ...typography.body2,
    color: colors.primary,
    width: '100%',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.7,
    backgroundColor: colors.button.disabled,
  },
});

export default Button;
