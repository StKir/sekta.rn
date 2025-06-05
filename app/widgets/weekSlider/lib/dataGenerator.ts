import { CALENDAR_CONSTANTS, DAY_NAMES, MONTH_NAMES } from '../constants';

import type { DayCardData, MasonryColumn } from '../WeekSlider.types';

const generateRandomHeight = (date: Date): number => {
  const seed = date.getDate() + date.getMonth() * 31 + date.getFullYear() * 365;
  const random = ((seed * 9301 + 49297) % 233280) / 233280;
  return Math.floor(
    CALENDAR_CONSTANTS.MIN_CARD_HEIGHT +
      random * (CALENDAR_CONSTANTS.MAX_CARD_HEIGHT - CALENDAR_CONSTANTS.MIN_CARD_HEIGHT)
  );
};

export const generateDayCard = (date: Date): DayCardData => {
  const today = new Date();
  const currentMonth = today.getMonth();

  return {
    date: new Date(date),
    dayNumber: date.getDate(),
    monthName: MONTH_NAMES[date.getMonth()],
    dayName: DAY_NAMES[date.getDay()],
    isCurrentMonth: date.getMonth() === currentMonth,
    isToday:
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear(),
    height: generateRandomHeight(date),
  };
};

export const generateDaysData = (centerDate?: Date): DayCardData[] => {
  const days: DayCardData[] = [];
  const today = centerDate || new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - CALENDAR_CONSTANTS.DAYS_BEFORE_TODAY);

  for (let i = 0; i < CALENDAR_CONSTANTS.DAYS_TO_SHOW; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    days.push(generateDayCard(currentDate));
  }

  return days;
};

export const generateNextDaysData = (lastDate: Date): DayCardData[] => {
  const days: DayCardData[] = [];
  const startDate = new Date(lastDate);
  startDate.setDate(lastDate.getDate() + 1);

  for (let i = 0; i < CALENDAR_CONSTANTS.DAYS_TO_SHOW; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    days.push(generateDayCard(currentDate));
  }

  return days;
};

export const createMasonryLayout = (days: DayCardData[]): MasonryColumn[] => {
  const columns: MasonryColumn[] = Array.from({ length: CALENDAR_CONSTANTS.COLUMNS_COUNT }, () => ({
    cards: [],
    totalHeight: 0,
  }));

  days.forEach((day) => {
    const shortestColumn = columns.reduce((prev, current) =>
      prev.totalHeight < current.totalHeight ? prev : current
    );

    shortestColumn.cards.push(day);
    shortestColumn.totalHeight += day.height + CALENDAR_CONSTANTS.CARD_SPACING;
  });

  return columns;
};
