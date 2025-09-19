import { View, Switch, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import notifee from '@notifee/react-native';

import { NotificationInputProps } from './types';
import { createStyles } from './styles';
import { LABELS, requestNotificationPermission } from './constants';

import Text from '@/shared/ui/Text/Text';
import { DateInput } from '@/shared/ui';
import { useTheme } from '@/shared/theme';
import { useUserStore } from '@/entities/user';

const NotificationInput = ({ label, value, onChange, style }: NotificationInputProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | null>(null);
  const [localTime, setLocalTime] = useState<Date | null>(value?.time || null);
  const [isEnabled, setIsEnabled] = useState(value?.active || false);
  const { setNotification } = useUserStore();

  useEffect(() => {
    setLocalTime(value?.time || null);
    setIsEnabled(value?.active || false);
  }, [value]);

  const handlePermissionRequest = async () => {
    const res = await requestNotificationPermission();

    if (res) {
      setPermissionStatus('granted');
      handleToggleNotification(true);
    } else {
      setPermissionStatus('denied');
    }
  };

  const handleTimeChange = (time: Date) => {
    setLocalTime(time);
    onChange({
      active: isEnabled,
      time,
    });
  };

  const handleToggleNotification = (newValue: boolean) => {
    if (newValue && permissionStatus !== 'granted') {
      handlePermissionRequest();
      return;
    }

    if (!newValue) {
      notifee.cancelAllNotifications();
    }

    setNotification({ active: newValue, time: localTime || new Date() });
    setIsEnabled(newValue);

    onChange({
      active: newValue,
      time: localTime || new Date(),
    });
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.header} onPress={() => handleToggleNotification(!isEnabled)}>
        <Text style={styles.label} variant='body2'>
          {label}
        </Text>
        <Switch
          ios_backgroundColor={colors.BACKGROUND_SECONDARY}
          thumbColor={colors.PRIMARY}
          trackColor={{ false: colors.BACKGROUND_SECONDARY, true: colors.PRIMARY }}
          value={isEnabled}
          onValueChange={handleToggleNotification}
        />
      </TouchableOpacity>

      {isEnabled && (
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel} variant='body2'>
            {LABELS.TIME}
          </Text>
          <DateInput
            label=''
            placeholder={LABELS.SELECT_TIME}
            type='time'
            value={localTime}
            onChange={handleTimeChange}
          />
        </View>
      )}

      {permissionStatus === 'denied' && (
        <Text style={styles.permissionText} variant='body2'>
          {LABELS.PERMISSION_DENIED}
        </Text>
      )}
    </View>
  );
};

export default NotificationInput;
