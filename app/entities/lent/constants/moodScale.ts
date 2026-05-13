export const MOOD_SCORE_BY_LABEL: Record<string, number> = {
  '🥳 Лучше всех': 5,
  '🤩 Хорошо': 4,
  '😐 Нормально': 3,
  '😟 Так себе': 2,
  '🤮 Очень плохо': 1,
};

export const POSITIVE_MOOD_THRESHOLD = 4;
export const NEGATIVE_MOOD_THRESHOLD = 2;

export const MAX_EMOTION_ROWS_IN_STATS = 5;

export const WEEKDAY_SHORT_LABELS_MON_FIRST = [
  'Пн',
  'Вт',
  'Ср',
  'Чт',
  'Пт',
  'Сб',
  'Вс',
] as const;

export const getMoodScoreFromLabel = (label: string): number | null => {
  const key = label.trim();
  const score = MOOD_SCORE_BY_LABEL[key];
  return score === undefined ? null : score;
};

export const getMoodEmojiPrefix = (label: string) => label.trim().slice(0, 2);

export const getWeekdayIndexMonFirst = (date: Date) => (date.getDay() + 6) % 7;
