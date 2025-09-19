import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

import AIPage from './AIPage';

import Statistic from '@/widgets/Statistic/Statistic';
import Feed from '@/widgets/Feed/Feed';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING, SIZES } from '@/shared/constants';
import SwipeableTabView, { SwipeableTabViewRef } from '@/shared/components/SwipeableTabView';
import TabSelectorTitle from '@/features/auth/TabSelectorTitle/TabSelectorTitle';

const tabs = ['Дневник', 'Статистика', 'AI'];

const CalendarPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const swipeableRef = useRef<SwipeableTabViewRef>(null);
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleTabPress = (tab: number) => {
    setActiveTab(tab);
    swipeableRef.current?.setPage(tab);
  };

  const handlePageSelected = (index: number) => {
    setActiveTab(index);
  };

  useEffect(() => {
    swipeableRef.current?.setPage(activeTab);
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.wrapper}>
      <View style={styles.container}>
        <TabSelectorTitle activeTab={activeTab} tabs={tabs} onTabPress={handleTabPress} />
      </View>
      <SwipeableTabView
        activeIndex={activeTab}
        ref={swipeableRef}
        style={styles.swipeableContainer}
        onPageSelected={handlePageSelected}
      >
        <Feed />

        <Statistic />
        <AIPage changeTab={handleTabPress} />
      </SwipeableTabView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    container: {
      paddingHorizontal: SPACING.LARGE,
    },
    swipeableContainer: {
      flex: 1,
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
    clearButton: {
      backgroundColor: colors.WARNING || '#FF9500',
    },
    clearButtonText: {
      color: 'white',
    },
  });

export default CalendarPage;
