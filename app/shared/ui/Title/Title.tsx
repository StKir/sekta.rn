import { TextStyle } from 'react-native';

import Text from '../Text';

import { createStyles } from './styles';

import { useTheme } from '@/shared/theme';

type TitleProps = {
  children: React.ReactNode;
  allowFontScaling?: boolean;
  style?: TextStyle;
} & TextStyle;

const Title = ({ children, allowFontScaling = false, ...props }: TitleProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors, { ...props });

  return (
    <Text allowFontScaling={allowFontScaling} style={styles.title}>
      {children}
    </Text>
  );
};

export default Title;
