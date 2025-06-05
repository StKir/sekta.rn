import { Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CALENDAR_CONSTANTS = {
  SLIDER_MARGIN: 20,
  DAYS_TO_SHOW: 60,
  DAYS_BEFORE_TODAY: 15,
  DAYS_AFTER_TODAY: 45,
  COLUMNS_COUNT: 2,
  COLUMN_SPACING: 10,
  CARD_SPACING: 10,
  MIN_CARD_HEIGHT: 120,
  MAX_CARD_HEIGHT: 200,
  SCREEN_CENTER: SCREEN_HEIGHT / 2,
  PAGINATION_THRESHOLD: 500,
  TODAY_BUTTON_THRESHOLD: 200,
};

export const GRID_LAYOUTS = [
  { width: 1, height: 1 },
  { width: 1, height: 1.5 },
  { width: 2, height: 1 },
  { width: 1, height: 2 },
  { width: 2, height: 1.5 },
];

export const DAY_NAMES = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

export const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];
