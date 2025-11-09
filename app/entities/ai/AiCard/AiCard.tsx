import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';

import Text from '@/shared/ui/Text';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';

export interface AICardProps {
  title: string;
  description: string;
  onPress: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const AICard = ({
  title,
  description,
  onPress,
  isLoading = false,
  disabled = false,
  icon,
}: AICardProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      style={[styles.blockContainer, disabled && styles.blockContainerDisabled]}
      onPress={onPress}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.blockTitle, disabled && styles.textDisabled]} variant='h3'>
          {title}
        </Text>
        {icon}
      </View>
      <Text style={[styles.blockDescription, disabled && styles.textDisabled]} variant='body2'>
        {description}
      </Text>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={colors.PRIMARY} size='small' />
        </View>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    blockContainer: {
      backgroundColor: colors.PRIMARY_ALPHA,
      borderRadius: 14,
      padding: SPACING.LARGE,
      minHeight: 100,
      marginBottom: SPACING.MEDIUM,
      borderWidth: 1,
      borderColor: colors.BORDER,
      position: 'relative',
      overflow: 'hidden',
    },
    blockContainerDisabled: {
      opacity: 0.6,
      backgroundColor: colors.BACKGROUND_SECONDARY,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.SMALL,
    },
    blockTitle: {
      color: colors.TEXT_PRIMARY,
      flex: 1,
    },
    blockDescription: {
      color: colors.TEXT_SECONDARY,
      marginBottom: SPACING.MEDIUM,
      lineHeight: 22,
    },
    textDisabled: {
      color: colors.TEXT_TERTIARY,
    },
    loaderContainer: {
      position: 'absolute',
      bottom: SPACING.MEDIUM,
      right: SPACING.MEDIUM,
    },
  });

export default AICard;
