import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

import Text from '@/shared/ui/Text/Text';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SIZES, SPACING } from '@/shared/constants';

type HeaderTitleProps = {
  title: string;
  subtitle: string;
  style?: StyleProp<ViewStyle>;
};

const HeaderTitle = ({ title, subtitle, style }: HeaderTitleProps) => {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.mainContainer}>
        <Text color={colors.GRAY_2} variant='h2'>
          {title}
        </Text>
      </View>
      {subtitle && (
        <Text color={colors.GRAY_2} variant='body1'>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: 'flex-start',
    },
    mainContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.SMALL,
    },
    backButton: {
      width: SIZES.ICON_SIZE_MEDIUM,
      height: SIZES.ICON_SIZE_MEDIUM,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: colors.GRAY_4,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default HeaderTitle;
