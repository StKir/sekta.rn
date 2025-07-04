import { useColorScheme } from 'react-native';
import React, { createContext, useContext, ReactNode } from 'react';

import { lightColors, darkColors } from './colors';

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
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;
  return (
    <ThemeContext.Provider value={{ isDark, colors: lightColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
