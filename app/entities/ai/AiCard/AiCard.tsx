import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';

import Text from '@/shared/ui/Text';
import { Button } from '@/shared/ui';
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

  const handlePress = () => {
    setIsLoading(true);
    onPress();
    setIsLoading(false);
  };

  return (
    <View style={styles.blockContainer}>
      <Text style={styles.blockTitle} variant='h3'>
        {title}
      </Text>
      <Text style={styles.blockDescription} variant='body2'>
        {description}
      </Text>
      <Button
        fullWidth
        loading={isLoading}
        title='Начать'
        variant='outline'
        onPress={handlePress}
      />
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    blockContainer: {
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderRadius: 14,
      padding: SPACING.LARGE,
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
