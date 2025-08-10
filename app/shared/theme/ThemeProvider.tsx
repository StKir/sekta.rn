import { useColorScheme } from 'react-native';
import React, { createContext, useContext, ReactNode, useEffect } from 'react';

import { lightColors, darkColors } from './colors';

import { useUserStore } from '@/entities/user/store/userStore';

type ThemeContextType = {
  isDark: boolean;
  colors: typeof lightColors | typeof darkColors;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightColors,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const colorScheme = useColorScheme();
  const { theme, loadUser } = useUserStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const isDark = theme === 'dark' || (theme === 'light' && colorScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  return <ThemeContext.Provider value={{ isDark, colors }}>{children}</ThemeContext.Provider>;
};
