import { useMemo } from 'react';

import { useLentStore } from '@/entities/lent/store/store';
import { buildMoodEmotionStats } from '@/entities/lent/lib/buildMoodEmotionStats';

export const useMoodEmotionInsights = (periodDays: number) => {
  const posts = useLentStore((s) => s.posts);
  return useMemo(() => buildMoodEmotionStats(posts, periodDays), [posts, periodDays]);
};
