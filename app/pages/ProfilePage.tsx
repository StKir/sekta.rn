import { SafeAreaView } from 'react-native-safe-area-context';
import PushNotification from 'react-native-push-notification';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { calculateAge, formatBirthDate, formatRegistrationDate } from '@/shared/utils/dateUtils';
import ThemeController from '@/shared/ui/ThemeController/ThemeController';
import Text from '@/shared/ui/Text';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { SPACING, SIZES } from '@/shared/constants';
import { RootStackParamList } from '@/navigation/types';
import { useTestResultsStore } from '@/entities/tests/store/testResultsStore';
import { useLentStore } from '@/entities/lent/store/store';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfilePage = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<NavigationProp>();

  const { clearAll: clearLentStore } = useLentStore();
  const { clearResults } = useTestResultsStore();
  const { userData, isLoading, loadUser, removeUser } = useUser();

  useEffect(() => {
    loadUser();

    PushNotification.channelExists('default', (exists) => {
      if (!exists) {
        PushNotification.createChannel(
          {
            channelId: 'default',
            channelName: 'Основной канал',
            channelDescription: 'Канал для основных уведомлений',
            playSound: true,
            soundName: 'default',
            importance: 4,
            vibrate: true,
          },
          (created) => console.log(`Канал уведомлений создан: ${created}`)
        );
      } else {
        console.log('Канал уже существует');
      }
    });
  }, [loadUser]);

  const getGenderText = (gender: any) => {
    if (typeof gender === 'object' && gender?.name) {
      return gender.name;
    }
    return gender || 'Не указан';
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleLogout = () => {
    try {
      // Удаляем все данные пользователя
      removeUser();
      clearLentStore();
      clearResults();

      // Переходим на регистрацию
      navigation.reset({
        index: 0,
        routes: [{ name: 'Register' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleClearAllData = () => {
    try {
      // Очищаем все данные
      clearLentStore();
      clearResults();
      console.log('Все данные очищены успешно');
    } catch (error) {
      console.error('Clear data error:', error);
    }
  };

  const handleCreateReminder = () => {
    try {
      const reminderTime = new Date(Date.now() + 6000);

      PushNotification.getChannels(function (channel_ids) {
        console.log('Доступные каналы:', channel_ids);
      });

      PushNotification.localNotificationSchedule({
        message: 'Привет! Это напоминание от приложения Секта',
        date: reminderTime,
        allowWhileIdle: true,
        channelId: 'default',
        title: 'Напоминание',
        bigText: 'Привет! Это напоминание от приложения Секта',
        subText: 'Создано через 6 секунд',
        vibrate: true,
        vibration: 300,
        priority: 'high',
        importance: 'high',
        playSound: true,
        soundName: 'default',
      });

      console.log('Напоминание создано на:', reminderTime.toISOString());
      console.log('Локальное время:', new Date().toLocaleString());
      console.log('UTC время:', new Date().toISOString());
    } catch (error) {
      console.error('Ошибка создания напоминания:', error);
    }
  };

  const handleCreateTimeBasedReminder = () => {
    try {
      const now = new Date();
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const reminderTime = new Date(now.getTime() + 10000);

      console.log('Текущее время пользователя:', now.toLocaleString());
      console.log('Часовой пояс пользователя:', userTimezone);
      console.log('Время напоминания:', reminderTime.toLocaleString());
      console.log('UTC время напоминания:', reminderTime.toISOString());

      PushNotification.localNotificationSchedule({
        message: 'Напоминание с учетом часового пояса!',
        date: reminderTime,
        allowWhileIdle: true,
        channelId: 'default',
        title: 'Напоминание',
        bigText: 'Это напоминание учитывает ваш часовой пояс',
        subText: `Создано в ${userTimezone}`,
        vibrate: true,
        vibration: 300,
        priority: 'high',
        importance: 'high',
        playSound: true,
        soundName: 'default',
      });
    } catch (error) {
      console.error('Ошибка создания напоминания с учетом времени:', error);
    }
  };

  const handleTestNotification = () => {
    try {
      PushNotification.localNotification({
        message: 'Тестовое уведомление!',
        channelId: 'default',
        title: 'Тест',
        bigText: 'Это тестовое уведомление для проверки работы',
        vibrate: true,
        vibration: 300,
        priority: 'high',
        importance: 'high',
        playSound: true,

        soundName: 'default',
      });

      console.log('Тестовое уведомление отправлено');
    } catch (error) {
      console.error('Ошибка тестового уведомления:', error);
    }
  };

  const renderUserProfile = () => {
    if (isLoading) {
      return (
        <View style={styles.userCard}>
          <Text style={styles.noDataText}>Загрузка...</Text>
        </View>
      );
    }

    if (!userData) {
      return (
        <View style={styles.userCard}>
          <Text style={styles.noDataText}>Данные пользователя не найдены</Text>
          <TouchableOpacity style={styles.registerButton} onPress={navigateToRegister}>
            <Text style={styles.registerButtonText}>Пройти регистрацию</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.userCard}>
        {/* Информация о пользователе */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName} variant='h2'>
            {userData.name || 'Не указано'}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} variant='body2'>
              Возраст:
            </Text>
            <Text style={styles.infoValue} variant='body1'>
              {userData.birthDate ? `${calculateAge(userData.birthDate)} лет` : 'Не указан'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} variant='body2'>
              Дата рождения:
            </Text>
            <Text style={styles.infoValue} variant='body1'>
              {userData.birthDate ? formatBirthDate(userData.birthDate) : 'Не указана'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} variant='body2'>
              Пол:
            </Text>
            <Text style={styles.infoValue} variant='body1'>
              {getGenderText(userData.gender)}
            </Text>
          </View>

          {userData.registrationDate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel} variant='body2'>
                Дата регистрации:
              </Text>
              <Text style={styles.infoValue} variant='body2'>
                {formatRegistrationDate(userData.registrationDate)}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title} variant='h2'>
        Профиль
      </Text>

      {renderUserProfile()}

      <View style={styles.buttonContainer}>
        <ThemeController />

        {/* <TouchableOpacity
          style={[styles.button, styles.reminderButton]}
          onPress={handleCreateReminder}
        >
          <Text style={styles.buttonText}>Создать напоминание (6 сек)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.timezoneButton]}
          onPress={handleCreateTimeBasedReminder}
        >
          <Text style={styles.buttonText}>Напоминание с учетом времени (10 сек)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.testButton]}
          onPress={handleTestNotification}
        >
          <Text style={styles.buttonText}>Тест уведомления</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClearAllData}>
          <Text style={[styles.buttonText, styles.clearButtonText]}>Очистить все данные</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={[styles.buttonText, styles.logoutButtonText]}>Выйти</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
      paddingHorizontal: SPACING.LARGE,
    },
    title: {
      fontSize: SIZES.FONT_SIZE.LARGE,
      fontWeight: 'bold',
      color: colors.TEXT_PRIMARY,
      textAlign: 'left',
      marginBottom: SPACING.LARGE,
    },
    userCard: {
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderRadius: 25,
      padding: SPACING.LARGE,
      borderWidth: 1,
      borderColor: colors.BORDER,
      marginBottom: SPACING.LARGE,
    },
    // Стили для состояния "нет данных"
    noDataText: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      color: colors.TEXT_SECONDARY,
      textAlign: 'center',
      marginBottom: SPACING.MEDIUM,
    },
    registerButton: {
      backgroundColor: colors.PRIMARY,
      borderRadius: 12,
      paddingHorizontal: SPACING.LARGE,
      paddingVertical: SPACING.MEDIUM,
      alignItems: 'center',
    },
    registerButtonText: {
      color: 'white',
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      fontWeight: '600',
    },
    // Медиа контейнеры
    mediaContainer: {
      marginBottom: SPACING.MEDIUM,
    },
    profileMedia: {
      height: 200,
      width: '100%',
      borderRadius: 25,
    },
    defaultAvatarContainer: {
      height: 200,
      width: '100%',
      backgroundColor: colors.GRAY_6,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.MEDIUM,
    },
    avatarEmoji: {
      fontSize: 80,
    },
    // Информация о пользователе
    userInfoContainer: {
      marginBottom: SPACING.MEDIUM,
    },
    userName: {
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.MEDIUM,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.SMALL,
    },
    infoLabel: {
      color: colors.TEXT_SECONDARY,
      flex: 1,
    },
    infoValue: {
      color: colors.TEXT_PRIMARY,
      flex: 2,
      textAlign: 'left',
    },

    // Кнопки
    buttonContainer: {
      gap: SPACING.MEDIUM,
    },
    button: {
      backgroundColor: colors.PRIMARY,
      borderRadius: 12,
      paddingHorizontal: SPACING.LARGE,
      paddingVertical: SPACING.MEDIUM,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      fontWeight: '600',
    },
    logoutButton: {
      backgroundColor: colors.DANGER,
    },
    logoutButtonText: {
      color: 'white',
    },
    clearButton: {
      backgroundColor: colors.WARNING || '#FF9500',
    },
    clearButtonText: {
      color: 'white',
    },
    reminderButton: {
      backgroundColor: colors.SUCCESS || '#34C759',
    },
    testButton: {
      backgroundColor: colors.INFO || '#007AFF',
    },
    timezoneButton: {
      backgroundColor: colors.WARNING || '#FF9500',
    },
  });

export default ProfilePage;
