import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';

import { lightColors, darkColors, useTheme } from '../../theme';
import { SPACING, SIZES } from '../../constants';

type ContainerRadialProps = {
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
} & React.PropsWithChildren;

const ContainerRadial = ({ children, style }: ContainerRadialProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return <SafeAreaView style={[styles.mainContainer, style]}>{children}</SafeAreaView>;
};

type ColorsType = typeof lightColors | typeof darkColors;

export const createStyles = (colors: ColorsType) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      height: '100%',
      backgroundColor: colors.DANGER_ALPHA,
      paddingHorizontal: SPACING.LARGE,
    },
    title: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      fontWeight: 'bold',
      margin: SPACING.MEDIUM,
      color: colors.TEXT_PRIMARY,
    },
  });

export default ContainerRadial;
