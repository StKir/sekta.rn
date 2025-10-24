import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import Text from '@/shared/ui/Text';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';

export type AICardProps = {
  title: string;
  description: string;
  onPress: () => void | Promise<void>;
};

const AICard = ({ title, description, onPress }: AICardProps) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const styles = createStyles(colors);

  const handlePress = async () => {
    setIsLoading(true);
    await onPress();
    setIsLoading(false);
  };

  return (
    <TouchableOpacity style={styles.blockContainer} onPress={handlePress}>
      <Text style={styles.blockTitle} variant='h3'>
        {title}
      </Text>
      <Text style={styles.blockDescription} variant='body2'>
        {description}
      </Text>
      {isLoading && <ActivityIndicator color={colors.PRIMARY} size='small' />}
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
    },
    blockTitle: {
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.SMALL,
    },
    blockDescription: {
      color: colors.TEXT_SECONDARY,
      marginBottom: SPACING.LARGE,
      lineHeight: 22,
    },
  });

export default AICard;
