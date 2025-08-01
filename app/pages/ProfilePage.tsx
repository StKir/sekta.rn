import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { StorageService } from '@/shared/utils/storage';
import Text from '@/shared/ui/Text';
import { FormAnswers } from '@/shared/types/form.types';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING, SIZES } from '@/shared/constants';
import { RootStackParamList } from '@/navigation/types';
import { useTestResultsStore } from '@/entities/tests/store/testResultsStore';
import { useLentStore } from '@/entities/lent/store/store';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfilePage = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<NavigationProp>();
  const [userData, setUserData] = useState<FormAnswers | null>(null);

  const { clearAll: clearLentStore } = useLentStore();
  const { clearResults } = useTestResultsStore();

  useEffect(() => {
    const loadUserData = () => {
      const user = StorageService.getUser();
      if (user) {
        // Добавляем дату регистрации если её нет
        if (!user.registrationDate) {
          user.registrationDate = new Date().toISOString();
          StorageService.setUser(user);
        }
        setUserData(user);
      }
    };

    loadUserData();
  }, []);

  const formatRegistrationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
      StorageService.removeUser();
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

      // Обновляем состояние компонента
      const user = StorageService.getUser();
      setUserData(user);
    } catch (error) {
      console.error('Clear data error:', error);
    }
  };

  const renderUserProfile = () => {
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
        {/* Аватар временно скрыт */}
        <View style={styles.defaultAvatarContainer}>
          {userData.avatar?.name ? (
            <Text style={styles.avatarEmoji}>{userData.avatar.name}</Text>
          ) : (
            <Text style={styles.avatarEmoji}>👤</Text>
          )}
        </View>

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
              {userData.age || 'Не указан'} лет
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
        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClearAllData}>
          <Text style={[styles.buttonText, styles.clearButtonText]}>Очистить все данные</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={[styles.buttonText, styles.logoutButtonText]}>Выйти</Text>
        </TouchableOpacity>
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
  });

export default ProfilePage;
