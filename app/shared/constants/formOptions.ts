export const SEX_OPTIONS = [
  { value: 'male', label: 'Муж', emoji: '👨' },
  { value: 'female', label: 'Жен', emoji: '👩' },
  { value: 'other', label: 'Другой', emoji: '🤡' },
] as const;

export const AVATAR_OPTIONS = [
  { id: '🚀', emoji: '🚀', name: 'Ракета' },
  { id: '🎭', emoji: '🎭', name: 'Актёр' },
  { id: '🦄', emoji: '🦄', name: 'Единорог' },
  { id: '🔥', emoji: '🔥', name: 'Огонь' },
  { id: '⚡', emoji: '⚡', name: 'Молния' },
  { id: '🌊', emoji: '🌊', name: 'Волна' },
  { id: '🎨', emoji: '🎨', name: 'Художник' },
  { id: '🎪', emoji: '🎪', name: 'Цирк' },
  { id: '🎸', emoji: '🎸', name: 'Рокер' },
  { id: '🕶️', emoji: '🕶️', name: 'Крутой' },
  { id: '👑', emoji: '👑', name: 'Король' },
  { id: '🎯', emoji: '🎯', name: 'Цель' },
] as const;

export const DATE_LIMITS = {
  MIN_YEAR: 1920,
  MIN_AGE: 13,
  MAX_AGE: 120,
} as const;
