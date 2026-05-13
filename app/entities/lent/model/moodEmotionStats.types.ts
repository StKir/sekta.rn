export type WeekdayIndexMonFirst = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type MoodWeekdaySlice = {
  weekdayIndex: WeekdayIndexMonFirst;
  shortLabel: string;
  sampleSize: number;
  dominantMoodLabel: string | null;
  dominantMoodEmoji: string;
  averageScore: number;
  positiveRatio: number;
  negativeRatio: number;
};

export type MoodDayCell = {
  date: Date;
  dayOfMonth: number;
  score: number | null;
  moodLabel: string | null;
};

export type EmotionFrequencyRow = {
  label: string;
  count: number;
  ratio: number;
};

export type MoodEmotionStatsModel = {
  moodByWeekday: MoodWeekdaySlice[];
  moodTimeline: MoodDayCell[];
  emotionsWeekday: EmotionFrequencyRow[];
  emotionsWeekend: EmotionFrequencyRow[];
  hasAnyMood: boolean;
  hasAnyEmotion: boolean;
};
