import {
  getMoodEmojiPrefix,
  getMoodScoreFromLabel,
  getWeekdayIndexMonFirst,
  MAX_EMOTION_ROWS_IN_STATS,
  MOOD_SCORE_BY_LABEL,
  NEGATIVE_MOOD_THRESHOLD,
  POSITIVE_MOOD_THRESHOLD,
  WEEKDAY_SHORT_LABELS_MON_FIRST,
} from '../constants/moodScale';

import type {
  EmotionFrequencyRow,
  MoodDayCell,
  MoodEmotionStatsModel,
  MoodWeekdaySlice,
  WeekdayIndexMonFirst,
} from '../model/moodEmotionStats.types';

import { Post, PostData } from '@/types/lentTypes';

const startOfLocalDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const collectTopEmotions = (
  counts: Map<string, number>,
  limit: number
): EmotionFrequencyRow[] => {
  const entries = [...counts.entries()].filter(([, c]) => c > 0);
  const total = entries.reduce((s, [, c]) => s + c, 0);
  if (total === 0) {
    return [];
  }
  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({
      label,
      count,
      ratio: count / total,
    }));
};

type CheckInMoodEvt = {
  sortKey: number;
  dayKey: string;
  moodLabel: string;
  score: number;
  weekdayMonFirst: WeekdayIndexMonFirst;
};

const dominantFromLabels = (labels: string[]) => {
  if (labels.length === 0) {
    return null;
  }
  const counts = labels.reduce<Record<string, number>>((acc, l) => {
    acc[l] = (acc[l] ?? 0) + 1;
    return acc;
  }, {});
  const sorted = Object.entries(counts).sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1];
    }
    return (MOOD_SCORE_BY_LABEL[b[0]] ?? 0) - (MOOD_SCORE_BY_LABEL[a[0]] ?? 0);
  });
  return sorted[0]?.[0] ?? null;
};

export const buildMoodEmotionStats = (
  posts: Post[],
  periodDays: number
): MoodEmotionStatsModel => {
  const windowStart = new Date();
  windowStart.setDate(windowStart.getDate() - periodDays);

  const filtered = posts.filter((p) => new Date(p.date) >= windowStart);

  const moodSamples: CheckInMoodEvt[] = [];
  const emotionCountsWeekday = new Map<string, number>();
  const emotionCountsWeekend = new Map<string, number>();

  filtered.forEach((post) => {
    const postTime = new Date(post.date).getTime();
    const baseDay = startOfLocalDay(new Date(post.date));
    const dayKey = baseDay.toDateString();
    const weekdayMonFirst = getWeekdayIndexMonFirst(baseDay) as WeekdayIndexMonFirst;
    const isWeekend = weekdayMonFirst >= 5;

    post.data.forEach((item: PostData, indexInPost) => {
      const sortKey = postTime - indexInPost;

      if (item.type === 'check-in') {
        const rawMood = item.data.mood?.trim();
        if (rawMood) {
          const score = getMoodScoreFromLabel(rawMood);
          if (score !== null) {
            moodSamples.push({
              sortKey,
              dayKey,
              moodLabel: rawMood,
              score,
              weekdayMonFirst,
            });
          }
        }
        item.data.emotions?.forEach((e) => {
          const label = e.trim();
          if (!label) {
            return;
          }
          const map = isWeekend ? emotionCountsWeekend : emotionCountsWeekday;
          map.set(label, (map.get(label) ?? 0) + 1);
        });
      }

      if (item.type === 'moment') {
        item.data.emotions?.forEach((e) => {
          const label = e.trim();
          if (!label) {
            return;
          }
          const map = isWeekend ? emotionCountsWeekend : emotionCountsWeekday;
          map.set(label, (map.get(label) ?? 0) + 1);
        });
      }
    });
  });

  const latestByDayKey = new Map<string, { sortKey: number; moodLabel: string; score: number }>();
  moodSamples.forEach((ev) => {
    const prev = latestByDayKey.get(ev.dayKey);
    if (!prev || ev.sortKey > prev.sortKey) {
      latestByDayKey.set(ev.dayKey, {
        sortKey: ev.sortKey,
        moodLabel: ev.moodLabel,
        score: ev.score,
      });
    }
  });

  const moodTimeline: MoodDayCell[] = [];
  for (let i = 0; i < periodDays; i++) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (periodDays - 1 - i));
    const key = d.toDateString();
    const pick = latestByDayKey.get(key);
    moodTimeline.push({
      date: d,
      dayOfMonth: d.getDate(),
      score: pick?.score ?? null,
      moodLabel: pick?.moodLabel ?? null,
    });
  }

  const weekdayBuckets: { scores: number[]; labels: string[] }[] =
    WEEKDAY_SHORT_LABELS_MON_FIRST.map(() => ({ scores: [], labels: [] }));

  moodSamples.forEach((ev) => {
    const b = weekdayBuckets[ev.weekdayMonFirst];
    b.scores.push(ev.score);
    b.labels.push(ev.moodLabel);
  });

  const moodByWeekday: MoodWeekdaySlice[] = weekdayBuckets.map((bucket, idx) => {
    const n = bucket.scores.length;
    const sum = n > 0 ? bucket.scores.reduce((s, x) => s + x, 0) : 0;
    const avg = n > 0 ? sum / n : 0;
    const positives = bucket.scores.filter((s) => s >= POSITIVE_MOOD_THRESHOLD).length;
    const negatives = bucket.scores.filter((s) => s <= NEGATIVE_MOOD_THRESHOLD).length;
    const domLabel = dominantFromLabels(bucket.labels);
    return {
      weekdayIndex: idx as WeekdayIndexMonFirst,
      shortLabel: WEEKDAY_SHORT_LABELS_MON_FIRST[idx],
      sampleSize: n,
      dominantMoodLabel: domLabel,
      dominantMoodEmoji: domLabel ? getMoodEmojiPrefix(domLabel) : '',
      averageScore: n > 0 ? Math.round((avg + Number.EPSILON) * 10) / 10 : 0,
      positiveRatio: n > 0 ? positives / n : 0,
      negativeRatio: n > 0 ? negatives / n : 0,
    };
  });

  return {
    moodByWeekday,
    moodTimeline,
    emotionsWeekday: collectTopEmotions(emotionCountsWeekday, MAX_EMOTION_ROWS_IN_STATS),
    emotionsWeekend: collectTopEmotions(emotionCountsWeekend, MAX_EMOTION_ROWS_IN_STATS),
    hasAnyMood: moodSamples.length > 0,
    hasAnyEmotion:
      [...emotionCountsWeekday.values()].some((c) => c > 0) ||
      [...emotionCountsWeekend.values()].some((c) => c > 0),
  };
};
