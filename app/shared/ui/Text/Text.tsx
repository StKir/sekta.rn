import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import React from 'react';

import { typography } from '@/shared/theme/typography';
import { useTheme } from '@/shared/theme';

type TypographyVariant = keyof typeof typography;

type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: string;
  allowFontScaling?: boolean;
};

const Text = ({
  variant = 'body1',
  color = 'textPrimary',
  style,
  allowFontScaling = false,
  ...props
}: TextProps) => {
  const { colors } = useTheme();

  const getColor = (colorProp: string) => {
    switch (colorProp) {
      case 'primary':
        return colors.PRIMARY;
      case 'textPrimary':
        return colors.TEXT_PRIMARY;
      case 'textSecondary':
        return colors.TEXT_SECONDARY;
      case 'textTertiary':
        return colors.TEXT_TERTIARY;
      case 'white':
        return colors.BACKGROUND_PRIMARY;
      case 'black':
        return colors.TEXT_PRIMARY;
      default:
        return colors.TEXT_PRIMARY;
    }
  };

  return (
    <RNText
      allowFontScaling={allowFontScaling}
      style={[typography[variant], { color: getColor(color) }, style]}
      {...props}
    />
  );
};

Text.H1 = (props: Omit<TextProps, 'variant'>) => <Text variant='h1' {...props} />;
Text.H2 = (props: Omit<TextProps, 'variant'>) => <Text variant='h2' {...props} />;
Text.H3 = (props: Omit<TextProps, 'variant'>) => <Text variant='h3' {...props} />;
Text.Body1 = (props: Omit<TextProps, 'variant'>) => <Text variant='body1' {...props} />;
Text.Body2 = (props: Omit<TextProps, 'variant'>) => <Text variant='body2' {...props} />;
Text.Button = (props: Omit<TextProps, 'variant'>) => <Text variant='button' {...props} />;

export default Text;
