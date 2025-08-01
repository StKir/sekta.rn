import { useMemo } from 'react';

import { PostData } from '@/types/lentTypes';
import { useLentStore } from '@/entities/lent/store/store';

export type DayData = {
  date: string;
  day: number;
  hasPost: boolean;
};

export type StatisticsData = {
  checkInCount: number;
  momentCount: number;
  mostFrequentMood: string | null;
  favoriteColor: string | null;
  favoriteActivity: string | null;
  favoriteEmotion: string | null;
  averageStress: number;
  averagePower: number;
};

export type DayStreakData = {
  dayStreakData: DayData[];
  longestStreak: number;
  currentStreak: number;
};

export const useStatistics = (days: number = 7): StatisticsData => {
  const { posts } = useLentStore();

  return useMemo(() => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    let checkInCount = 0;
    let momentCount = 0;
    const moodAnswers: string[] = [];
    const colorNames: string[] = [];
    const activities: string[] = [];
    const emotions: string[] = [];
    let totalStress = 0;
    let totalPower = 0;
    let stressCount = 0;
    let powerCount = 0;

    // Фильтруем посты по выбранному периоду для основной статистики
    const filteredPosts = posts.filter((post) => {
      const postDate = new Date(post.date);
      return postDate >= daysAgo;
    });

    filteredPosts.forEach((post) => {
      post.data.forEach((item: PostData) => {
        if (item.type === 'check-in') {
          checkInCount++;
          if (item.data.mood) {
            moodAnswers.push(item.data.mood);
          }
          if (item.data.color?.name) {
            colorNames.push(item.data.color.name);
          }
          if (item.data.activities) {
            activities.push(...item.data.activities);
          }
          if (item.data.emotions) {
            emotions.push(...item.data.emotions);
          }
          if (item.data.stress !== undefined) {
            totalStress += item.data.stress;
            stressCount++;
          }
          if (item.data.power !== undefined) {
            totalPower += item.data.power;
            powerCount++;
          }
        } else if (item.type === 'moment') {
          momentCount++;
          if (item.data.emotions) {
            emotions.push(...item.data.emotions);
          }
        }
      });
    });

    const getMostFrequent = (arr: string[]) => {
      if (arr.length === 0) {
        return null;
      }
      const counts = arr.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] || null;
    };

    return {
      checkInCount,
      momentCount,
      mostFrequentMood: getMostFrequent(moodAnswers),
      favoriteColor: getMostFrequent(colorNames),
      favoriteActivity: getMostFrequent(activities),
      favoriteEmotion: getMostFrequent(emotions),
      averageStress: stressCount > 0 ? Math.round(totalStress / stressCount) : 0,
      averagePower: powerCount > 0 ? Math.round(totalPower / powerCount) : 0,
    };
  }, [posts, days]);
};

export const useDayStreakData = (): DayStreakData => {
  const { posts } = useLentStore();

  return useMemo(() => {
    // Создаем карту дней с постами (всегда за 30 дней)
    const postsMap = new Map<string, boolean>();

    posts.forEach((post) => {
      const dateStr = new Date(post.date).toDateString();
      postsMap.set(dateStr, true);
    });

    // Генерируем данные для последних 30 дней
    const dayStreakData: DayData[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();

      dayStreakData.push({
        date: dateStr,
        day: date.getDate(),
        hasPost: postsMap.has(dateStr) || false,
      });
    }

    // Вычисляем самую длинную серию и текущую серию
    const calculateStreaks = (data: DayData[]) => {
      let maxStreak = 0;
      let currentStreakCount = 0;
      let tempStreak = 0;

      // Считаем текущую серию (с конца)
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].hasPost) {
          currentStreakCount++;
        } else {
          break;
        }
      }

      // Считаем максимальную серию
      data.forEach((day) => {
        if (day.hasPost) {
          tempStreak++;
          maxStreak = Math.max(maxStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      });

      return { longestStreak: maxStreak, currentStreak: currentStreakCount };
    };

    const { longestStreak, currentStreak } = calculateStreaks(dayStreakData);

    return {
      dayStreakData,
      longestStreak,
      currentStreak,
    };
  }, [posts]);
};
