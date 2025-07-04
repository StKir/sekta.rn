import { View, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import Statistic from '@/widgets/Statistic/Statistic';
import Feed from '@/widgets/Feed/Feed';
import { StorageService } from '@/shared/utils/storage';
import PageContainer from '@/shared/ui/Container/PageContainer';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { SPACING, SIZES } from '@/shared/constants';
import { RootStackParamList } from '@/navigation/types';
import TabSelectorTitle from '@/features/auth/TabSelectorTitle/TabSelectorTitle';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const tabs = ['Календарь', 'Статистика'];

const CalendarPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const styles = createStyles(colors);

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

  const renderContent = () => {
    if (activeTab === 0) {
      return <Feed />;
    }
    return <Statistic />;
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      <PageContainer>
        <View style={styles.container}>
          <TabSelectorTitle
            activeTab={activeTab}
            tabs={tabs}
            onTabPress={(tab) => setActiveTab(tab)}
          />
        </View>
        {renderContent()}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={navigateToRegister}>
            <Text style={styles.buttonText}>Демо регистрации</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={[styles.buttonText, styles.logoutButtonText]}>Выйти</Text>
          </TouchableOpacity>
        </View>
      </PageContainer>
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: SPACING.LARGE,
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
