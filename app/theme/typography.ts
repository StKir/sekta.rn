import { TextStyle } from 'react-native';

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  } as TextStyle,
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  } as TextStyle,
  body1: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,
  body2: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,
  button: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,
} as const;
