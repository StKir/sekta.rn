/* eslint-disable react-native/no-unused-styles */
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, ScrollView, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import React from 'react';

import HeaderTitle from '@/shared/ui/HeaderTitle/HeaderTitle';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useAppNavigation } from '@/shared/hooks/useAppNavigation';
import { SIZES, SPACING, Z_INDEX } from '@/shared/constants';

type FormWrapperProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  showBackButton?: boolean;
};

const FormStepWrapper = ({
  children,
  title = 'Регистрация',
  subtitle,
  showHeader = true,
  contentStyle,
  containerStyle,
  showBackButton = true,
}: FormWrapperProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useAppNavigation();

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.container, containerStyle]}>
          {showHeader && (
            <View style={styles.headerContainer}>
              {showBackButton && (
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Ionicons
                    color={colors.GRAY_1}
                    name='chevron-back'
                    size={SIZES.ICON_SIZE_XSMALL}
                  />
                </TouchableOpacity>
              )}
              <HeaderTitle subtitle={subtitle || ''} title={title} />
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.LARGE,
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
    container: {
      zIndex: Z_INDEX.CONTENT,
      elevation: Z_INDEX.CONTENT,
      marginBottom: 100,
      justifyContent: 'flex-start',
      padding: SPACING.LARGE,
    },
    content: {
      paddingHorizontal: SPACING.MEDIUM,
      paddingVertical: SPACING.LARGE,
      borderRadius: SPACING.LARGE,
      backgroundColor: colors.BACKGROUND_SECONDARY,
      gap: SPACING.LARGE,
    },
  });

export default FormStepWrapper;
