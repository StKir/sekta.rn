import { ViewStyle } from 'react-native';

export interface NotificationInputProps {
  label: string;
  value?: {
    active: boolean;
    time: Date | null;
  };
  onChange: (value: { active: boolean; time: Date | null }) => void;
  style?: ViewStyle;
}
