import { Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SPACING = {
  SMALL: 5,
  MEDIUM: 10,
  LARGE: 20,
  XLARGE: 30,
};

export const SIZES = {
  TAB_BAR_HEIGHT: 85,
  CARD_WIDTH_RATIO: 0.9,
  CARD_HEIGHT: SCREEN_HEIGHT * 0.7,
  TEXT_CONTAINER_HEIGHT: 'auto',
  ANIMATION_DURATION: 300,
  STACK_SEPARATION: 25,
  STACK_SIZE: 6,
  FONT_SIZE: {
    SMALL: 16,
    MEDIUM: 20,
    LARGE: 22,
  },
};

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
