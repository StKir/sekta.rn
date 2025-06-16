import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { StorageService } from '@/shared/utils/storage';
import ContainerRadial from '@/shared/ui/ContainerRadial/ContainerRadial';
import { useTheme } from '@/shared/theme';
import { SPACING, SIZES } from '@/shared/constants';
import { RootStackParamList } from '@/navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const CalendarPage = () => {
  const [userData, setUserData] = useState<any>(null);
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await StorageService.getUser();
      setUserData(user);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          try {
            await StorageService.removeUser();
            navigation.navigate('Register');
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  const getSexLabel = (sex: string) => {
    switch (sex) {
      case 'male':
        return 'Мужской';
      case 'female':
        return 'Женский';
      case 'other':
        return 'Другой';
      default:
        return sex;
    }
  };

  return (
    <ContainerRadial>
      <View style={styles.container}>
        <Text style={styles.title}>Календарь</Text>

        {userData && (
          <View style={styles.userCard}>
            <Text style={styles.avatar}>{userData.avatar}</Text>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userInfo}>
              {userData.age} лет, {getSexLabel(userData.sex)}
            </Text>
            <Text style={styles.registrationDate}>
              Регистрация: {new Date(userData.registeredAt).toLocaleDateString()}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={navigateToRegister}>
            <Text style={styles.buttonText}>Демо регистрации</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={[styles.buttonText, styles.logoutButtonText]}>Выйти</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ContainerRadial>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: SPACING.LARGE,
    },
    title: {
      fontSize: SIZES.FONT_SIZE.LARGE,
      fontWeight: 'bold',
      color: colors.TEXT_PRIMARY,
    },
    userCard: {
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderRadius: 12,
      padding: SPACING.LARGE,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.GRAY_4,
      minWidth: 250,
    },
    avatar: {
      fontSize: 50,
      marginBottom: SPACING.MEDIUM,
    },
    userName: {
      fontSize: SIZES.FONT_SIZE.LARGE,
      fontWeight: 'bold',
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.SMALL,
    },
    userInfo: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      color: colors.TEXT_SECONDARY,
      marginBottom: SPACING.SMALL,
    },
    registrationDate: {
      fontSize: SIZES.FONT_SIZE.SMALL,
      color: colors.TEXT_TERTIARY,
    },
    buttonContainer: {
      gap: SPACING.MEDIUM,
      alignItems: 'center',
    },
    button: {
      backgroundColor: colors.PRIMARY,
      borderRadius: 12,
      paddingHorizontal: SPACING.LARGE,
      paddingVertical: SPACING.MEDIUM,
      minWidth: 200,
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
  });

export default CalendarPage;
