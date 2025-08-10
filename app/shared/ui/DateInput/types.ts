export type DateInputType = 'date' | 'time';

export type DateInputProps = {
  label?: string;
  error?: string;
  value?: Date | null;
  onChange: (date: Date) => void;
  type?: DateInputType;
  placeholder?: string;
  style?: any;
};
