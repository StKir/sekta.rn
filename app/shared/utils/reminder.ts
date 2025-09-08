import notifee, {
  AndroidCategory,
  AndroidImportance,
  NotificationAndroid,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

import { getRandomInt } from './numberUtils';
import { getDateWithOffset, isDatePassed } from './dateUtils';

type ReminderProps = {
  date: Date;
  title: string;
  body: string;
};

const remindersTitles = [
  'Как у тебя дела?',
  'Расскажи, что ты сегодня делал?',
  'Че ты голова?',
  'Заполни чекин',
  'Ты почему мне не пишешь?',
  'Заполни меня',
];

const remindersBodies = [
  'Сегодня хороший день?',
  'Ты помнишь про меня?',
  'А ты сегодня покушал?',
  'Все за сегодня успел?',
];

export const getRemindersContent = () => ({
  title: `<p style="color: #0a0d67;"><b>${
    remindersTitles[getRandomInt(0, remindersTitles.length - 1)]
  }</span></p></b></p> &#128576;`,
  body: remindersBodies[getRandomInt(0, remindersBodies.length - 1)],
});

export const getRemindersData = (date: Date) => ({
  date: date,
  title: `<p style="color: #0a0d67;"><b>${
    remindersTitles[getRandomInt(0, remindersTitles.length - 1)]
  }</span></p></b></p> &#128576;`,
  body: remindersBodies[getRandomInt(0, remindersBodies.length - 1)],
});

export const setReminder = async (
  reminder: ReminderProps,
  androidChannelId: string,
  triggerOptions?: Omit<TimestampTrigger, 'type' | 'timestamp'>,
  androidOptions?: NotificationAndroid
) => {
  const isLate = isDatePassed(reminder.date);

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: isLate
      ? getDateWithOffset(1, reminder.date.getHours(), reminder.date.getMinutes()).getTime()
      : reminder.date.getTime(),
    ...triggerOptions,
  };

  await notifee.createTriggerNotification(
    {
      ...getRemindersData(reminder.date),
      android: {
        channelId: androidChannelId,
        category: AndroidCategory.EVENT,
        color: '#3C66FF',
        sound: 'default',
        importance: AndroidImportance.HIGH,
        ...androidOptions,
      },
    },
    trigger
  );
};

export const setReminders = async (date: Date) => {
  try {
    const channels = await notifee.getChannels();

    const reminderChanel = channels.find((channel) => channel.id === 'main-channel-alert');

    if (!reminderChanel) {
      await notifee.createChannel({
        id: 'main-channel-alert',
        name: 'reminder-channel',
        description: 'reminder-channel',
      });
    }

    await setReminder(getRemindersData(date), 'main-channel-alert', {
      repeatFrequency: RepeatFrequency.DAILY,
    });
  } catch (error) {
    console.error('Ошибка создания напоминания:', error);
  }
};

export const updateReminder = async (id: string, date: Date) => {
  try {
    const reminders = await notifee.getTriggerNotifications();
    const reminder = reminders.find((rem) => rem.notification.id === id);

    if (!reminder) {
      console.log('Reminder not found');
      return;
    }
    await notifee.cancelTriggerNotification(id);

    await setReminder(getRemindersData(date), 'main-channel-alert', {
      repeatFrequency: RepeatFrequency.DAILY,
    });
  } catch (error) {
    console.error('Ошибка обновления напоминания:', error);
  }
};

export const getReminders = async () => {
  const notifications = await notifee.getTriggerNotifications();
  return notifications;
};

export const getInitialReminderID = async () => {
  const res = await getReminders().then(
    (notifications) =>
      notifications.find(
        (notification) =>
          'repeatFrequency' in notification.trigger &&
          notification.trigger.repeatFrequency === RepeatFrequency.DAILY
      )?.notification.id
  );

  return res;
};

export const removeAllReminders = async () => {
  try {
    await notifee.cancelAllNotifications();
  } catch (error) {
    console.error('Ошибка удаления всех напоминаний:', error);
  }
};
