import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';

import Text from '@/shared/ui/Text/Text';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useAppNavigation } from '@/shared/hooks/useAppNavigation';
import { SIZES, SPACING } from '@/shared/constants';

type HeaderTitleProps = {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  style?: StyleProp<ViewStyle>;
};

const HeaderTitle = ({ title, subtitle, showBackButton = true, style }: HeaderTitleProps) => {
  const { colors } = useTheme();
  const navigation = useAppNavigation();
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.mainContainer}>
        {showBackButton && (
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons color={colors.GRAY_1} name='chevron-back' size={SIZES.ICON_SIZE_XSMALL} />
          </TouchableOpacity>
        )}
        <Text color={colors.GRAY_1} variant='h2'>
          {title}
        </Text>
      </View>

      <Text color={colors.GRAY_2} variant='body1'>
        {subtitle}
      </Text>
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
      zIndex: 1,
      width: SIZES.ICON_SIZE_MEDIUM,
      height: SIZES.ICON_SIZE_MEDIUM,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.GRAY_4,
    },
  });

export default HeaderTitle;
