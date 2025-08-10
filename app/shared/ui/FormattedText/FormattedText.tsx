import Markdown from 'react-native-markdown-display';
import { TextStyle } from 'react-native';
import React from 'react';

interface FormattedTextProps {
  children: string;
  style?: TextStyle;
  numberOfLines?: number;
}

import { useTheme } from '@/shared/theme';

const FormattedText = ({ children }: FormattedTextProps) => {
  const { colors } = useTheme();
  return (
    <Markdown
      style={{
        body: { color: colors.TEXT_PRIMARY, fontSize: 20 },
        heading1: { color: colors.TEXT_PRIMARY, fontWeight: '800', fontSize: 24 },
      }}
    >
      {children}
    </Markdown>
  );
};

export default FormattedText;
