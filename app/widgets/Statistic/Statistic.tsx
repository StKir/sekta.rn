/* eslint-disable react-native/no-unused-styles */
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';

import { useStatistics, useDayStreakData } from './useStatistics';
import StatsPeriodFilter from './StatsPeriodFilter';
import { MoodEmotionInsights } from './MoodEmotionInsights';
import DayStreak from './DayStreak';

import Text from '@/shared/ui/Text';
import Tag from '@/shared/ui/Tag/Tag';
import { SubscriptionBanner } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';
import { useUserStore } from '@/entities/user';
import Stats from '@/entities/lent/ui/Stats/Stats';

const Statistic = () => {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const stats = useStatistics(selectedPeriod);
  const { tariffInfo } = useUserStore();

  const dayStreakStats = useDayStreakData();

  const isTrial = tariffInfo?.status !== 'PRO';

  const styles = createStyles(colors);

  const StatCard = ({
    subtitle,
    title,
    value,
  }: {
    subtitle?: string;
    title: string;
    value: string | number;
  }) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle} variant='body2'>
        {title}
      </Text>
      <Text style={styles.statValue} variant='h2'>
        {value}
      </Text>
      {subtitle ? (
        <Text style={styles.statSubtitle} variant='body2'>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      <Text style={styles.title} variant='h2'>
        Статистика за {selectedPeriod}{' '}
        {selectedPeriod === 1 ? 'день' : selectedPeriod < 5 ? 'дня' : 'дней'}
      </Text>

      <StatsPeriodFilter selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

      {isTrial && (
        <SubscriptionBanner
          subtitle='Получите подробную статистику по вашим постам'
          title='Разблокируйте PRO функции'
        />
      )}
      <DayStreak days={dayStreakStats.dayStreakData} longestStreak={dayStreakStats.longestStreak} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle} variant='h3'>
          Типы постов
        </Text>
        <View style={styles.rowContainer}>
          <View style={styles.row}>
            <StatCard title='Чекины' value={stats.checkInCount} />
            <StatCard title='Моменты' value={stats.momentCount} />
          </View>

          <View style={styles.row}>
            <StatCard title='Заметки' value={stats.noteCount} />
            <StatCard title='АИ анализ' value={stats.aiTextCount} />
          </View>
        </View>
      </View>

      {isTrial && (
        <Text style={styles.sectionTitle} variant='h3'>
          Доступно с PRO ⭐
        </Text>
      )}

      <View style={isTrial ? { opacity: 0.5 } : {}}>
        <View style={styles.section}>
          <MoodEmotionInsights locked={isTrial} periodDays={selectedPeriod} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} variant='h3'>
            Средние показатели
          </Text>
          <Stats locked={isTrial} power={stats.averagePower} stress={stats.averageStress} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} variant='h3'>
            Самые частые ответы
          </Text>
          {isTrial ? (
            <>
              <View style={styles.frequentItem}>
                <Text style={styles.frequentLabel} variant='body1'>
                  Настроение:
                </Text>
                <Text style={styles.frequentLocked} variant='h2'>
                  —
                </Text>
              </View>
              <View style={styles.frequentItem}>
                <Text style={styles.frequentLabel} variant='body1'>
                  Любимый цвет:
                </Text>
                <Text style={styles.frequentLocked} variant='h2'>
                  —
                </Text>
              </View>
              <View style={styles.frequentItem}>
                <Text style={styles.frequentLabel} variant='body1'>
                  Любимое занятие:
                </Text>
                <Text style={styles.frequentLocked} variant='h2'>
                  —
                </Text>
              </View>
              <View style={styles.frequentItem}>
                <Text style={styles.frequentLabel} variant='body1'>
                  Частая эмоция:
                </Text>
                <Text style={styles.frequentLocked} variant='h2'>
                  —
                </Text>
              </View>
            </>
          ) : (
            <>
              {stats.mostFrequentMood && (
                <View style={styles.frequentItem}>
                  <Text style={styles.frequentLabel} variant='body1'>
                    Настроение:
                  </Text>
                  <Tag text={stats.mostFrequentMood} variant='small' />
                </View>
              )}

              {stats.favoriteColor && (
                <View style={styles.frequentItem}>
                  <Text style={styles.frequentLabel} variant='body1'>
                    Любимый цвет:
                  </Text>
                  <Tag text={stats.favoriteColor} variant='small' />
                </View>
              )}

              {stats.favoriteActivity && (
                <View style={styles.frequentItem}>
                  <Text style={styles.frequentLabel} variant='body1'>
                    Любимое занятие:
                  </Text>
                  <Tag text={stats.favoriteActivity} variant='small' />
                </View>
              )}

              {stats.favoriteEmotion && (
                <View style={styles.frequentItem}>
                  <Text style={styles.frequentLabel} variant='body1'>
                    Частая эмоция:
                  </Text>
                  <Tag text={stats.favoriteEmotion} variant='small' />
                </View>
              )}
            </>
          )}
        </View>
      </View>
      <View style={{ height: bottom }} />
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      height: '100%',
    },
    contentContainer: {
      padding: SPACING.LARGE,
      flexGrow: 1,
    },
    title: {
      marginBottom: SPACING.LARGE,
    },
    section: {
      marginBottom: SPACING.XLARGE,
    },
    rowContainer: {
      gap: SPACING.MEDIUM,
    },
    sectionTitle: {
      marginBottom: SPACING.MEDIUM,
      color: colors.TEXT_PRIMARY,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: SPACING.MEDIUM,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.SURFACE,
      padding: SPACING.MEDIUM,
      borderRadius: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.BORDER,
    },
    statTitle: {
      color: colors.TEXT_SECONDARY,
      marginBottom: SPACING.SMALL,
    },
    statValue: {
      color: colors.PRIMARY,
      fontWeight: '600',
    },
    statSubtitle: {
      color: colors.TEXT_SECONDARY,
      marginTop: SPACING.SMALL,
    },
    frequentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.MEDIUM,
      backgroundColor: colors.SURFACE,
      padding: SPACING.MEDIUM,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.BORDER,
    },
    frequentLabel: {
      flex: 1,
      color: colors.TEXT_PRIMARY,
    },
    frequentLocked: {
      color: colors.TEXT_TERTIARY,
    },
  });

export default Statistic;
