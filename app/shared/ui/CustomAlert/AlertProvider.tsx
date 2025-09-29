/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import { AlertOptions, AlertContextType, AlertButton } from './types';
import CustomAlert from './CustomAlert';
import { setGlobalAlert } from './AlertOverride';

const AlertContext = createContext<AlertContextType | undefined>(undefined);

type AlertProviderProps = {
  children: ReactNode;
};

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alertState, setAlertState] = useState<{
    isVisible: boolean;
    options: AlertOptions | null;
  }>({
    isVisible: false,
    options: null,
  });

  const alert = (title: string, message?: string, buttons?: AlertButton[]) => {
    const defaultButtons: AlertButton[] = [{ text: 'OK', style: 'default' }];
    const finalButtons = buttons && buttons.length > 0 ? buttons : defaultButtons;

    const options: AlertOptions = {
      title,
      message,
      buttons: finalButtons,
      type: 'default',
    };

    setAlertState({
      isVisible: true,
      options,
    });
  };

  const closeAlert = () => {
    setAlertState({
      isVisible: false,
      options: null,
    });
  };

  useEffect(() => {
    setGlobalAlert(alert);
  }, []);

  const contextValue: AlertContextType = {
    alert,
    closeAlert,
    isVisible: alertState.isVisible,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {alertState.options && (
        <CustomAlert
          options={alertState.options}
          visible={alertState.isVisible}
          onClose={closeAlert}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
