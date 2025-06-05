// Типы для временных периодов
export type TimePeriod = {
  id: number;
  name: string;
  hours: string;
};

// Тип для пропсов ячейки таблицы
export type TableCellProps = {
  day: Date;
  timePeriod: TimePeriod;
  onPress: (day: Date, timePeriod: TimePeriod) => void;
};

// Тип для пропсов строки таблицы
export type TableRowProps = {
  timePeriod: TimePeriod;
  weekDays: Date[];
  onCellPress: (day: Date, timePeriod: TimePeriod) => void;
};

// Тип для пропсов заголовка таблицы
export type TableHeaderProps = {
  weekDays: Date[];
};
