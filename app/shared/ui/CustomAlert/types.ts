import { ReactNode } from 'react';

export type AlertType = 'default' | 'success' | 'error' | 'warning' | 'info';

export type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

export type AlertOptions = {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  type?: AlertType;
  autoClose?: boolean;
  autoCloseTime?: number;
  onClose?: () => void;
};

export type AlertContextType = {
  alert: (title: string, message?: string, buttons?: AlertButton[]) => void;
  closeAlert: () => void;
  isVisible: boolean;
};

export type AlertState = {
  isVisible: boolean;
  options: AlertOptions | null;
};

export type AlertProviderProps = {
  children: ReactNode;
};
