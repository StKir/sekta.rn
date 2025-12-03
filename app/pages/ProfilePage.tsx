/* eslint-disable no-console */
/* eslint-disable react-native/no-unused-styles */
import { SafeAreaView } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { setReminders } from '@/shared/utils/reminder';
import { calculateAge, formatBirthDate, formatRegistrationDate } from '@/shared/utils/dateUtils';
import ThemeController from '@/shared/ui/ThemeController/ThemeController';
import TextArea from '@/shared/ui/TextArea/TextArea';
import Text from '@/shared/ui/Text';
import NotificationInput from '@/shared/ui/NotificationInput/NotificationInput';
import { SubscriptionBanner } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { useOTAUpdate } from '@/shared/hooks/useOTAUpdate';
import useCheckUser from '@/shared/hooks/useCheckUser';
import { SPACING, SIZES } from '@/shared/constants';
import { authApi } from '@/shared/api/authApi';
import { apiClient } from '@/shared/api/apiClient';
import { RootStackParamList } from '@/navigation/types';
import { useUserStore } from '@/entities/user';
import { useTestResultsStore } from '@/entities/tests/store/testResultsStore';
import { useLentStore } from '@/entities/lent/store/store';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfilePage = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<NavigationProp>();
  const { version } = useOTAUpdate();

  const { clearAll: clearLentStore } = useLentStore();
  const { clearResults } = useTestResultsStore();
  const { userData, isLoading, removeUser } = useUser();
  const {
    setNotification,
    notification,
    updateUser,
    tariffInfo,
    token,
    setToken,
    setAuthenticated,
  } = useUserStore();
  useCheckUser();
  const hasToken = token || apiClient.getToken();

  const getGenderText = (gender: any) => {
    if (typeof gender === 'object' && gender?.name) {
      return gender.name;
    }
    return gender || 'Не указан';
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToLogin = () => {
    navigation.navigate('LoginScreen', { isPaywall: false });
  };

  const handleOnboarding = () => {
    navigation.navigate('OnboardingPage');
  };

  const handleLogout = () => {
    try {
      Alert.alert('Вы уверены, что хотите выйти?', 'Это действие нельзя будет отменить', [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить данные',
          onPress: () => {
            authApi.logout();
            apiClient.clearToken();
            setToken(null);
            setAuthenticated(false);
            removeUser();
            clearLentStore();
            clearResults();

            navigation.reset({
              index: 0,
              routes: [{ name: 'Register' }],
            });
          },
        },
      ]);
    } catch (error) {
      console.error('Logout error:', error);
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
          {tariffInfo && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel} variant='body2'>
                Подписка:
              </Text>
              <Text style={styles.infoValue} variant='body2'>
                {tariffInfo?.status}
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderUserProfile()}

        <View style={styles.buttonContainer}>
          <TextArea
            label='О тебе'
            multiline={true}
            numberOfLines={6}
            placeholder='Расскажи о себе, что тебе нравится, чем увлекаешься, чего ты хочешь достичь'
            value={userData?.about_me || ''}
            onChangeText={(value) => {
              updateUser({ about_me: value });
            }}
          />

          <ThemeController />

          <NotificationInput
            label='Ежедневные уведомления'
            value={{
              active: notification?.active || false,
              time: notification?.time ? new Date(notification?.time) : null,
            }}
            onChange={async (newNotification) => {
              if (userData) {
                try {
                  const notificationData = {
                    active: newNotification.active,
                    time: newNotification.time,
                  };

                  if (notificationData.time) {
                    setReminders(new Date(notificationData.time)).then(() => {
                      setNotification(notificationData);
                    });
                  }
                } catch {
                  Alert.alert('Произошла ошибка(');
                }
              }
            }}
          />

          {!hasToken && (
            <View style={styles.userCard}>
              <TouchableOpacity style={styles.loginButton} onPress={navigateToLogin}>
                <Text style={styles.loginButtonText}>Войти / Зарегистрироваться</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* <TouchableOpacity
          style={[styles.button, styles.testButton]}
          onPress={async () => {
            try {
              await sendTestNotification();
              } catch (error) {
                console.log(error);
                }
                }}
                >
                <Text style={styles.buttonText}>Отправить тестовое уведомление</Text>
                </TouchableOpacity> */}

          {/* <TouchableOpacity style={[styles.button, styles.feedbackButton]} onPress={handleFeedback}>
            <Text style={[styles.buttonText, styles.logoutButtonText]}>Связь с разработчиком</Text>
          </TouchableOpacity> */}
          <SubscriptionBanner
            subtitle='Получите персонального AI-ассистента'
            title='Разблокируйте PRO функции'
          />

          <TouchableOpacity
            style={[styles.button, styles.feedbackButton]}
            onPress={handleOnboarding}
          >
            <Text style={[styles.buttonText, styles.logoutButtonText]}>Обучение</Text>
          </TouchableOpacity>
          {hasToken && (
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
              <Text style={[styles.buttonText, styles.logoutButtonText]}>Очистить данные</Text>
            </TouchableOpacity>
          )}
          <Text variant='body2'>
            Версия: {DeviceInfo.getVersion() + '.' + version.state.version}
          </Text>
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
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
    loginButton: {
      backgroundColor: colors.PRIMARY,
      borderRadius: 12,
      paddingHorizontal: SPACING.LARGE,
      paddingVertical: SPACING.MEDIUM,
      alignItems: 'center',
    },
    loginButtonText: {
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
      gap: SPACING.LARGE,
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
    feedbackButton: {
      backgroundColor: colors.INFO,
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
    testButton: {
      backgroundColor: 'red',
      padding: 20,
      margin: 20,
      borderRadius: 10,
    },
    testButtonText: {
      color: 'white',
      textAlign: 'center',
    },
    bottomSpacer: {
      height: 150,
    },
    reminderButton: {
      backgroundColor: colors.SUCCESS || '#34C759',
    },
    timezoneButton: {
      backgroundColor: colors.WARNING || '#FF9500',
    },
  });

export default ProfilePage;
