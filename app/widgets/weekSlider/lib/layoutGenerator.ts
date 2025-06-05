import type { WeekLayoutType, CellPosition } from '../WeekSlider.types';

export const getWeekLayoutType = (weekStart: Date): WeekLayoutType => {
  const layouts: WeekLayoutType[] = ['grid3x3', 'compact', 'staggered', 'centered', 'asymmetric'];
  const weekNumber = Math.floor(weekStart.getTime() / (7 * 24 * 60 * 60 * 1000));
  return layouts[weekNumber % layouts.length];
};

export const getLayoutPositions = (layoutType: WeekLayoutType): CellPosition[] => {
  switch (layoutType) {
    case 'grid3x3':
      return [
        { row: 0, col: 0, width: 1, height: 1 }, // пн
        { row: 0, col: 1, width: 1, height: 1 }, // вт
        { row: 0, col: 2, width: 1, height: 1 }, // ср
        { row: 1, col: 0, width: 1, height: 1 }, // чт
        { row: 1, col: 1, width: 1, height: 1 }, // пт
        { row: 1, col: 2, width: 1, height: 1 }, // сб
        { row: 2, col: 0, width: 1, height: 1 }, // вс
      ];

    case 'compact':
      return [
        { row: 0, col: 0, width: 1, height: 1 }, // пн
        { row: 0, col: 1, width: 1, height: 1 }, // вт
        { row: 0, col: 2, width: 1, height: 1 }, // ср
        { row: 1, col: 0, width: 1, height: 1 }, // чт
        { row: 1, col: 2, width: 1, height: 1 }, // пт
        { row: 2, col: 0, width: 1, height: 1 }, // сб
        { row: 2, col: 2, width: 1, height: 1 }, // вс
      ];

    case 'staggered':
      return [
        { row: 0, col: 1, width: 1, height: 1 }, // пн
        { row: 0, col: 2, width: 1, height: 1 }, // вт
        { row: 1, col: 0, width: 1, height: 1 }, // ср
        { row: 1, col: 1, width: 1, height: 1 }, // чт
        { row: 1, col: 2, width: 1, height: 1 }, // пт
        { row: 2, col: 0, width: 1, height: 1 }, // сб
        { row: 2, col: 1, width: 1, height: 1 }, // вс
      ];

    case 'centered':
      return [
        { row: 0, col: 1, width: 1, height: 1 }, // пн
        { row: 1, col: 0, width: 1, height: 1 }, // вт
        { row: 1, col: 1, width: 1, height: 1 }, // ср
        { row: 1, col: 2, width: 1, height: 1 }, // чт
        { row: 2, col: 0, width: 1, height: 1 }, // пт
        { row: 2, col: 1, width: 1, height: 1 }, // сб
        { row: 2, col: 2, width: 1, height: 1 }, // вс
      ];

    case 'asymmetric':
      return [
        { row: 0, col: 0, width: 1, height: 1 }, // пн
        { row: 0, col: 1, width: 1, height: 1 }, // вт
        { row: 1, col: 0, width: 1, height: 1 }, // ср
        { row: 1, col: 2, width: 1, height: 1 }, // чт
        { row: 2, col: 1, width: 1, height: 1 }, // пт
        { row: 2, col: 2, width: 1, height: 1 }, // сб
        { row: 0, col: 2, width: 1, height: 1 }, // вс
      ];

    default:
      return getLayoutPositions('grid3x3');
  }
};
