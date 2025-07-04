import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import React from 'react';

import { typography } from '@/shared/theme/typography';

type TypographyVariant = keyof typeof typography;

type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: string;
};

const Text = ({ variant = 'body1', color = 'primary', style, ...props }: TextProps) => {
  return <RNText style={[typography[variant], { color: color }, style]} {...props} />;
};

Text.H1 = (props: Omit<TextProps, 'variant'>) => <Text variant='h1' {...props} />;
Text.H2 = (props: Omit<TextProps, 'variant'>) => <Text variant='h2' {...props} />;
Text.Body1 = (props: Omit<TextProps, 'variant'>) => <Text variant='body1' {...props} />;
Text.Body2 = (props: Omit<TextProps, 'variant'>) => <Text variant='body2' {...props} />;
Text.Button = (props: Omit<TextProps, 'variant'>) => <Text variant='button' {...props} />;

export default Text;
