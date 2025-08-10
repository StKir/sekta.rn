import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useMemo } from 'react';

import Text from '@/shared/ui/Text/Text';
import { typography } from '@/shared/theme/typography';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useUserStore } from '@/entities/user/store/userStore';

type ThemeOption = {
  value: 'light' | 'dark';
  label: string;
  icon: string;
};

const ThemeController = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { theme, setTheme } = useUserStore();

  const themeOptions: ThemeOption[] = useMemo(
    () => [
      {
        value: 'light',
        label: 'Светлая',
        icon: '☀️',
      },
      {
        value: 'dark',
        label: 'Темная',
        icon: '🌙',
      },
    ],
    []
  );

  const handleThemeChange = (selectedTheme: 'light' | 'dark') => {
    setTheme(selectedTheme);
  };

  const isSelected = (optionValue: 'light' | 'dark') => {
    return theme === optionValue;
  };

  return (
    <View>
      <Text style={styles.label} variant='body1'>
        Тема приложения
      </Text>
      <View style={styles.buttonsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.button, isSelected(option.value) && styles.buttonActive]}
            onPress={() => handleThemeChange(option.value)}
          >
            <Text style={styles.iconText}>{option.icon}</Text>
            <Text style={[styles.buttonText, isSelected(option.value) && styles.buttonTextActive]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    label: {
      marginBottom: 10,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.TEXT_SECONDARY,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    buttonActive: {
      backgroundColor: colors.PRIMARY,
      borderColor: colors.PRIMARY,
    },
    iconText: {
      fontSize: 24,
    },
    buttonText: {
      ...typography.body2,
      color: colors.TEXT_SECONDARY,
      textAlign: 'center',
    },
    buttonTextActive: {
      color: colors.BACKGROUND_PRIMARY,
    },
  });

export default ThemeController;
