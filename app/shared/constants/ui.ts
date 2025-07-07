import { Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SPACING = {
  SMALL: 5,
  MEDIUM: 10,
  LARGE: 12,
  LARGE_2: 20,
  XLARGE: 30,
};

export const Z_INDEX = {
  HEADER: 100,
  BACK_BUTTON: 101,
  CONTENT: 102,
};

export const SIZES = {
  TAB_BAR_HEIGHT: 90,
  CARD_WIDTH_RATIO: 0.9,
  CARD_HEIGHT: SCREEN_HEIGHT * 0.7,
  TEXT_CONTAINER_HEIGHT: 'auto',
  ANIMATION_DURATION: 300,
  STACK_SEPARATION: 25,
  STACK_SIZE: 6,
  ICON_SIZE_MEDIUM: 32,
  ICON_SIZE_SMALL: 30,
  ICON_SIZE_XSMALL: 22,
  FONT_SIZE: {
    SMALL: 16,
    MEDIUM: 20,
    LARGE: 22,
    XLARGE: 24,
    XXLARGE: 32,
  },
  FONT_WEIGHT: {
    REGULAR: '400',
    MEDIUM: '500',
    BOLD: '700',
  },
} as const;

export const OPACITY = {
  INITIAL: 0.6,
  FULL: 1,
  SEMI_TRANSPARENT: 0.4,
};

export const SCALE = {
  INITIAL: 0.9,
  FULL: 1,
};

export const SHADOW = {
  OPACITY: 0.4,
  RADIUS: 5,
  OFFSET: { width: 0, height: 2 },
};
