export const DATE_INPUT_CONSTANTS = {
  HEIGHT: 56,
  BORDER_RADIUS: 12,
  PADDING_HORIZONTAL: 16,
  LABEL_MARGIN_BOTTOM: 8,
  ERROR_MARGIN_TOP: 4,
  ACTIVE_OPACITY: 0.7,
} as const;

export const DATE_FORMATS = {
  DATE: {
    day: '2-digit' as const,
    month: '2-digit' as const,
    year: 'numeric' as const,
  },
  TIME: {
    hour: '2-digit' as const,
    minute: '2-digit' as const,
  },
} as const;

export const PLACEHOLDERS = {
  DATE: 'Выберите дату',
  TIME: 'Выберите время',
} as const;

export const TITLES = {
  DATE: 'Выберите дату',
  TIME: 'Выберите время',
} as const;

export const BUTTON_TEXTS = {
  CONFIRM: 'Готово',
  CANCEL: 'Отмена',
} as const;
