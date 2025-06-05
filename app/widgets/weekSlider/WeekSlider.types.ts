export type WeekSliderProps = {
  initialDate?: Date;
  onDateChange?: (date: Date) => void;
  onCurrentMonthChange?: (monthName: string) => void;
};

export type WeekData = {
  weekStart: Date;
  days: DayData[];
  layoutType: WeekLayoutType;
};

export type DayData = {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export type WeekLayoutType = 'grid3x3' | 'compact' | 'staggered' | 'centered' | 'asymmetric';

export type CellPosition = {
  row: number;
  col: number;
  width: number;
  height: number;
};

export type DayCardData = {
  date: Date;
  dayNumber: number;
  monthName: string;
  dayName: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  height: number;
};

export type MasonryColumn = {
  cards: DayCardData[];
  totalHeight: number;
};

export type GridItem = {
  data: DayCardData;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PaginationState = {
  isLoading: boolean;
  hasMore: boolean;
  lastDate: Date;
};

export type CardPositionMap = Map<string, number>;

export type MasonryLayoutProps = {
  columns: MasonryColumn[];
  onDayPress?: (date: Date) => void;
  onPositionsUpdate?: (positions: CardPositionMap) => void;
};
