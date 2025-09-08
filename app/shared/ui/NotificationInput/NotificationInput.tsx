import { View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import { NotificationInputProps } from './types';
import { createStyles } from './styles';
import {
  NOTIFICATION_CONSTANTS,
  BUTTON_TEXTS,
  LABELS,
  requestNotificationPermission,
} from './constants';

import Text from '@/shared/ui/Text/Text';
import { DateInput } from '@/shared/ui';
import { useTheme } from '@/shared/theme';

const NotificationInput = ({ label, value, onChange, style }: NotificationInputProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | null>(null);

  const handlePermissionRequest = async () => {
    const res = await requestNotificationPermission();

    if (res) {
      setPermissionStatus('granted');
      onChange({
        active: true,
        time: value?.time || new Date(),
      });
    } else {
      setPermissionStatus('denied');
    }
  };

  const handleTimeChange = (time: Date) => {
    onChange({
      active: permissionStatus === 'granted',
      time: time || null,
    });
  };

  const handleToggleNotification = () => {
    if (permissionStatus === 'granted') {
      onChange({
        active: !value?.active,
        time: value?.time || new Date(),
      });
    } else {
      handlePermissionRequest();
    }
  };

  const isNotificationEnabled = value?.active || permissionStatus === 'granted';

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label} variant='body2'>
        {label}
      </Text>

      <TouchableOpacity
        activeOpacity={NOTIFICATION_CONSTANTS.ACTIVE_OPACITY}
        style={[styles.permissionButton, isNotificationEnabled && styles.permissionButtonActive]}
        onPress={handleToggleNotification}
      >
        <Text
          style={[
            styles.permissionButtonText,
            isNotificationEnabled && styles.permissionButtonTextActive,
          ]}
        >
          {isNotificationEnabled ? BUTTON_TEXTS.DISABLE : BUTTON_TEXTS.ENABLE}
        </Text>
      </TouchableOpacity>

      {isNotificationEnabled && (
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel} variant='body2'>
            {LABELS.TIME}
          </Text>
          <DateInput
            label=''
            placeholder={LABELS.SELECT_TIME}
            type='time'
            value={value?.time}
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
