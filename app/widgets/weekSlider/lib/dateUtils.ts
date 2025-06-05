import { WEEK_SLIDER_CONSTANTS } from '../constants';

import type { WeekData, DayData } from '../WeekSlider.types';

import { getWeekLayoutType } from './layoutGenerator';

export const getStartOfWeek = (date: Date): Date => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

export const addWeeks = (date: Date, weeks: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
};

export const generateWeekData = (weekStart: Date): WeekData => {
  const days: DayData[] = [];
  const today = new Date();

  for (let i = 0; i < WEEK_SLIDER_CONSTANTS.DAYS_IN_WEEK; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + i);

    const dayData: DayData = {
      date: currentDate,
      dayNumber: currentDate.getDate(),
      isCurrentMonth: currentDate.getMonth() === weekStart.getMonth(),
      isToday:
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear(),
    };

    days.push(dayData);
  }

  return {
    weekStart,
    days,
    layoutType: getWeekLayoutType(weekStart),
  };
};

export const generateWeeksData = (centerWeek: Date): WeekData[] => {
  const weeks: WeekData[] = [];
  const centerWeekStart = getStartOfWeek(new Date(centerWeek));

  for (
    let i = -WEEK_SLIDER_CONSTANTS.INITIAL_WEEK_INDEX;
    i < WEEK_SLIDER_CONSTANTS.WEEKS_TO_SHOW - WEEK_SLIDER_CONSTANTS.INITIAL_WEEK_INDEX;
    i++
  ) {
    const weekStart = addWeeks(new Date(centerWeekStart), i);
    weeks.push(generateWeekData(weekStart));
  }

  return weeks;
};
