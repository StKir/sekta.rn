import { ThemeColors } from './types';

export const lightColors: ThemeColors = {
  PRIMARY: '#007AFF',
  PRIMARY_LITE: 'rgba(0, 122, 255, 0.05)',
  SECONDARY: '#5AC8FA',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  DANGER: '#FF3B30',
  INFO: '#5856D6',

  GRAY_1: '#8E8E93',
  GRAY_2: '#AEAEB2',
  GRAY_3: '#C7C7CC',
  GRAY_4: '#D1D1D6',
  GRAY_5: '#E5E5EA',
  GRAY_6: '#F2F2F7',

  BUTTON_TEXT: '#F6F6F6',

  BACKGROUND_PRIMARY: '#F6F6F6',
  BACKGROUND_SECONDARY: '#F6F6F6',
  TEXT_PRIMARY: '#2C2C2C',
  TEXT_SECONDARY: '#4C4C4C',
  TEXT_TERTIARY: '#8E8E93',

  SEPARATOR: 'rgba(60, 60, 67, 0.29)',
  SHADOW: 'rgba(0, 0, 0, 0.3)',

  PRIMARY_ALPHA: 'rgba(0, 122, 255, 0.1)',
  DANGER_ALPHA: 'rgba(255, 59, 48, 0.1)',
  SUCCESS_ALPHA: 'rgba(52, 199, 89, 0.1)',

  PINK: '#FF2D55',
  YELLOW: '#FFCC00',
  TEAL: '#5AC8FA',

  BORDER: 'rgba(0, 0, 0, 0.1)',
  SURFACE: 'rgba(255, 255, 255, 0.8)',
} as const;

export const darkColors: ThemeColors = {
  PRIMARY: '#0A84FF',
  PRIMARY_LITE: 'rgba(10, 132, 255, 0.1)',
  SECONDARY: '#5AC8FA',
  SUCCESS: '#30D158',
  WARNING: '#FF9F0A',
  DANGER: '#FF453A',
  INFO: '#5E5CE6',

  GRAY_1: '#8E8E93',
  GRAY_2: '#636366',
  GRAY_3: '#48484A',
  GRAY_4: '#3A3A3C',
  GRAY_5: '#2C2C2E',
  GRAY_6: '#1C1C1E',

  BUTTON_TEXT: '#F6F6F6',

  BACKGROUND_PRIMARY: '#121212',
  BACKGROUND_SECONDARY: '#1E1E1E',
  TEXT_PRIMARY: '#E5E5E5',
  TEXT_SECONDARY: '#B3B3B3',
  TEXT_TERTIARY: '#7D7D7D',

  SEPARATOR: 'rgba(84, 84, 88, 0.6)',
  SHADOW: 'rgba(0, 0, 0, 0.6)',

  PRIMARY_ALPHA: 'rgba(10, 132, 255, 0.2)',
  DANGER_ALPHA: 'rgba(255, 69, 58, 0.2)',
  SUCCESS_ALPHA: 'rgba(48, 209, 88, 0.2)',

  PINK: '#FF375F',
  YELLOW: '#FFD60A',
  TEAL: '#64D2FF',

  BORDER: 'rgba(255, 255, 255, 0.1)',
  SURFACE: 'rgba(30, 30, 30, 0.8)',
} as const;
