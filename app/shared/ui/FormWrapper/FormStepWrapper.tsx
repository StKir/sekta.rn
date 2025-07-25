import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, ScrollView, ViewStyle, StyleProp } from 'react-native';
import React from 'react';

import HeaderTitle from '@/shared/ui/HeaderTitle/HeaderTitle';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING, Z_INDEX } from '@/shared/constants';

type FormWrapperProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

const FormStepWrapper = ({
  children,
  title = 'Регистрация',
  subtitle,
  showHeader = true,
  contentStyle,
  containerStyle,
}: FormWrapperProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.container, containerStyle]}>
          {showHeader && (
            <View style={styles.headerContainer}>
              <HeaderTitle showBackButton={false} subtitle={subtitle || ''} title={title} />
            </View>
          )}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    headerContainer: {
      paddingVertical: SPACING.MEDIUM,
    },
    container: {
      zIndex: Z_INDEX.CONTENT,
      elevation: Z_INDEX.CONTENT,
      marginBottom: 100,
      justifyContent: 'flex-start',
      padding: SPACING.LARGE,
    },
    content: {
      paddingHorizontal: SPACING.MEDIUM,
      paddingVertical: SPACING.MEDIUM,
      borderRadius: SPACING.LARGE,
      backgroundColor: colors.BACKGROUND_SECONDARY,
      gap: SPACING.LARGE,
    },
  });

export default FormStepWrapper;
