/* eslint-disable react-native/no-unused-styles */
import { View, StyleSheet, LayoutChangeEvent, useWindowDimensions } from 'react-native';
import React, { useCallback, useState } from 'react';

import {
  INSIGHT_HINT_FONT,
  LAYOUT_WIDTH_FALLBACK_RATIO,
  MOOD_LEGEND_DOT,
  SECTION_TITLE_TOP,
  SUBSECTION_RADIUS,
} from './moodEmotionInsights.constants';
import { useMoodEmotionInsights } from './hooks/useMoodEmotionInsights';
import WeekdayMoodRow from './components/WeekdayMoodRow';
import MoodHeatStrip from './components/MoodHeatStrip';
import EmotionSplitColumns from './components/EmotionSplitColumns';

import Title from '@/shared/ui/Title/Title';
import Text from '@/shared/ui/Text';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SIZES, SPACING } from '@/shared/constants';

type MoodEmotionInsightsProps = {
  locked?: boolean;
  periodDays: number;
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    outer: {},
    measure: {
      width: '100%',
    },
    headTitle: {
      marginBottom: SPACING.MEDIUM,
      color: colors.TEXT_PRIMARY,
    },
    subsection: {
      backgroundColor: colors.SURFACE,
      borderRadius: SUBSECTION_RADIUS,
      borderWidth: 1,
      borderColor: colors.BORDER,
      padding: SPACING.MEDIUM,
      marginBottom: SPACING.MEDIUM,
    },
    subsectionLast: {
      marginBottom: 0,
    },
    sectionHead: {
      marginBottom: SPACING.SMALL,
    },
    sectionSub: {
      color: colors.TEXT_SECONDARY,
    },
    hint: {
      color: colors.TEXT_TERTIARY,
      marginTop: SPACING.SMALL,
      fontSize: INSIGHT_HINT_FONT,
    },
    emptyHint: {
      color: colors.TEXT_SECONDARY,
      marginTop: SPACING.SMALL,
    },
    legendRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: SECTION_TITLE_TOP,
      gap: SPACING.MEDIUM,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.SMALL,
    },
    legendDot: {
      width: MOOD_LEGEND_DOT,
      height: MOOD_LEGEND_DOT,
      borderRadius: MOOD_LEGEND_DOT / 2,
    },
    legendText: {
      color: colors.TEXT_SECONDARY,
      fontSize: INSIGHT_HINT_FONT,
    },
  });

const MoodEmotionInsights = ({ locked, periodDays }: MoodEmotionInsightsProps) => {
  const { colors } = useTheme();
  const { width: winW } = useWindowDimensions();
  const styles = createStyles(colors);
  const [contentWidth, setContentWidth] = useState(0);
  const data = useMoodEmotionInsights(periodDays);

  const onLayoutInner = useCallback((e: LayoutChangeEvent) => {
    setContentWidth(e.nativeEvent.layout.width);
  }, []);

  const layoutWidth =
    contentWidth > 0 ? contentWidth : Math.max(280, winW * LAYOUT_WIDTH_FALLBACK_RATIO);

  if (locked) {
    return (
      <View style={styles.outer}>
        <Text style={styles.headTitle} variant='h3'>
          Настроение и эмоции
        </Text>
        <View style={styles.subsection}>
          <View style={styles.sectionHead}>
            <Title
              color={colors.TEXT_PRIMARY}
              fontSize={SIZES.FONT_SIZE.MEDIUM}
              fontWeight={SIZES.FONT_WEIGHT.MEDIUM}
              marginBottom={SPACING.SMALL}
              marginVertical={0}
            >
              По дням недели
            </Title>
            <Text style={styles.sectionSub} variant='body2'>
              Доминирующее настроение и доля лёгких / тяжёлых дней
            </Text>
          </View>
        </View>
        <View style={styles.subsection}>
          <View style={styles.sectionHead}>
            <Title
              color={colors.TEXT_PRIMARY}
              fontSize={SIZES.FONT_SIZE.MEDIUM}
              fontWeight={SIZES.FONT_WEIGHT.MEDIUM}
              marginBottom={SPACING.SMALL}
              marginVertical={0}
            >
              Календарь настроения
            </Title>
            <Text style={styles.sectionSub} variant='body2'>
              Последний чекин за каждый день периода
            </Text>
          </View>
        </View>
        <View style={[styles.subsection, styles.subsectionLast]}>
          <View style={styles.sectionHead}>
            <Title
              color={colors.TEXT_PRIMARY}
              fontSize={SIZES.FONT_SIZE.MEDIUM}
              fontWeight={SIZES.FONT_WEIGHT.MEDIUM}
              marginBottom={SPACING.SMALL}
              marginVertical={0}
            >
              Эмоции: будни и выходные
            </Title>
            <Text style={styles.sectionSub} variant='body2'>
              Теги из чекинов и моментов
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (!data.hasAnyMood && !data.hasAnyEmotion) {
    return (
      <View style={styles.outer}>
        <Text style={styles.headTitle} variant='h3'>
          Настроение и эмоции
        </Text>
        <Text style={styles.emptyHint} variant='body2'>
          Добавьте эмоциональные чекины — здесь появятся графики по дням и эмоциям.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.outer}>
      <Text style={styles.headTitle} variant='h3'>
        Настроение и эмоции
      </Text>

      <View style={styles.measure} onLayout={onLayoutInner}>
        {data.hasAnyMood ? (
          <View style={styles.subsection}>
            <View style={styles.sectionHead}>
              <Title
                color={colors.TEXT_PRIMARY}
                fontSize={SIZES.FONT_SIZE.MEDIUM}
                fontWeight={SIZES.FONT_WEIGHT.MEDIUM}
                marginBottom={SPACING.SMALL}
                marginVertical={0}
              >
                По дням недели
              </Title>
              <Text style={styles.sectionSub} variant='body2'>
                Доминирующее настроение и доля лёгких / тяжёлых дней
              </Text>
            </View>
            <WeekdayMoodRow contentWidth={layoutWidth} slices={data.moodByWeekday} />
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.SUCCESS }]} />
                <Text style={styles.legendText} variant='body2'>
                  легче
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.GRAY_4 }]} />
                <Text style={styles.legendText} variant='body2'>
                  нейтрально
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.DANGER }]} />
                <Text style={styles.legendText} variant='body2'>
                  тяжелее
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {data.hasAnyMood ? (
          <View style={styles.subsection}>
            <View style={styles.sectionHead}>
              <Title
                color={colors.TEXT_PRIMARY}
                fontSize={SIZES.FONT_SIZE.MEDIUM}
                fontWeight={SIZES.FONT_WEIGHT.MEDIUM}
                marginBottom={SPACING.SMALL}
                marginVertical={0}
              >
                Календарь настроения
              </Title>
              <Text style={styles.sectionSub} variant='body2'>
                Последний чекин за каждый день периода
              </Text>
            </View>
            <MoodHeatStrip cells={data.moodTimeline} contentWidth={layoutWidth} />
            <Text style={styles.hint} variant='body2'>
              Слева раньше · справа ближе к сегодня
            </Text>
          </View>
        ) : null}

        {data.hasAnyEmotion ? (
          <View style={[styles.subsection, styles.subsectionLast]}>
            <View style={styles.sectionHead}>
              <Title
                color={colors.TEXT_PRIMARY}
                fontSize={SIZES.FONT_SIZE.MEDIUM}
                fontWeight={SIZES.FONT_WEIGHT.MEDIUM}
                marginBottom={SPACING.SMALL}
                marginVertical={0}
              >
                Эмоции: будни и выходные
              </Title>
              <Text style={styles.sectionSub} variant='body2'>
                Теги из чекинов и моментов
              </Text>
            </View>
            <EmotionSplitColumns
              contentWidth={layoutWidth}
              weekdayRows={data.emotionsWeekday}
              weekendRows={data.emotionsWeekend}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default MoodEmotionInsights;
