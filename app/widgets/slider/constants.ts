import { Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const SWIPER = {
  MAX_SWIPE_DISTANCE: SCREEN_WIDTH * 0.4,
  ANIMATION_DURATION: 300,
  SECOND_CARD_ZOOM: 0.9,
  STACK_SCALE: 5,
} as const;

export const LABELS = {
  LIKE: 'ДА',
  DISLIKE: 'НЕТ',
  BUTTON_TEXT: 'Перейти',
} as const; 