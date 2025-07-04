import { Text, TextStyle } from 'react-native';

import { createStyles } from './styles';

import { useTheme } from '@/shared/theme';

type TitleProps = {
  children: React.ReactNode;
} & TextStyle;

const Title = ({ children, ...props }: TitleProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors, { ...props });

  return <Text style={styles.title}>{children}</Text>;
};

export default Title;
