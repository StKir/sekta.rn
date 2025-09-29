import { Alert } from 'react-native';

import { AlertButton } from './types';

let globalAlertFunction:
  | ((title: string, message?: string, buttons?: AlertButton[]) => void)
  | null = null;

export const setGlobalAlert = (
  alertFn: (title: string, message?: string, buttons?: AlertButton[]) => void
) => {
  globalAlertFunction = alertFn;
};

const originalAlert = Alert.alert;

Alert.alert = (title: string, message?: string, buttons?: any, options?: any) => {
  if (globalAlertFunction) {
    let customButtons: AlertButton[] = [];

    if (buttons && Array.isArray(buttons) && buttons.length > 0) {
      customButtons = buttons.map((btn: any) => ({
        text: btn.text || 'OK',
        onPress: btn.onPress,
        style: btn.style || 'default',
      }));
    } else {
      customButtons = [{ text: 'OK', style: 'default' }];
    }

    globalAlertFunction(title, message, customButtons);
  } else {
    originalAlert(title, message, buttons, options);
  }
};

export { Alert };
