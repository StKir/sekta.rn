import Icon from 'react-native-vector-icons/Ionicons';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import React from 'react';

import Text from '@/shared/ui/Text';
import { typography } from '@/shared/theme/typography';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'primary-light';

type ButtonProps = {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  style?: ViewStyle;
  icon?: string;
  textStyle?: TextStyle;
  sticky?: boolean;
  loading?: boolean;
};

const Button = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  style,
  textStyle,
  sticky = false,
  icon,
  loading = false,
}: ButtonProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.button];

    if (variant === 'primary') {
      baseStyle.push(styles.primaryButton);
    }
    if (variant === 'primary-light') {
      baseStyle.push(styles.primaryLightButton);
    }
    if (variant === 'secondary') {
      baseStyle.push(styles.secondaryButton);
    }
    if (variant === 'outline') {
      baseStyle.push(styles.outlineButton);
    }
    if (variant === 'text') {
      baseStyle.push(styles.textButton);
    }

    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    if (sticky) {
      baseStyle.push(styles.sticky);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextColor = () => {
    if (disabled) {
      return colors.BACKGROUND_PRIMARY;
    }
    if (variant === 'outline') {
      return colors.PRIMARY;
    }

    if (variant === 'text') {
      return textStyle?.color || colors.TEXT_PRIMARY;
    }

    if (variant === 'primary-light') {
      return colors.PRIMARY;
    }

    return colors.BUTTON_TEXT;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      style={getButtonStyle()}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={colors.PRIMARY} size='small' />
      ) : (
        <>
          {title && (
            <Text.Button style={[textStyle, { color: getTextColor() }]}>{title}</Text.Button>
          )}
          {icon && <Icon color={getTextColor()} name={icon} size={24} />}
        </>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors: ThemeColors, insets: EdgeInsets) =>
  StyleSheet.create({
    button: {
      height: 48,
      borderRadius: 12,
      alignSelf: 'flex-start',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      flexDirection: 'row',
      gap: 10,
    },
    primaryButton: {
      backgroundColor: colors.PRIMARY,
    },
    primaryLightButton: {
      backgroundColor: colors.PRIMARY_ALPHA,
    },
    secondaryButton: {
      backgroundColor: colors.GRAY_3,
    },
    outlineButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.PRIMARY,
    },
    textButton: {
      ...typography.body2,
      color: colors.TEXT_PRIMARY,
      textAlign: 'center',
      width: '100%',
      justifyContent: 'center',
    },
    fullWidth: {
      width: '100%',
    },
    disabled: {
      opacity: 0.7,
    },
    sticky: {
      position: 'absolute',
      bottom: insets.bottom + 10,
      left: SPACING.LARGE,
      right: SPACING.LARGE,
      width: undefined,
      alignSelf: 'stretch',
      zIndex: 1000,
      shadowColor: '#000',
      elevation: 8,
    },
  });

export default Button;
