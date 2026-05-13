/* eslint-disable react-native/no-unused-styles */
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import React from 'react';

import {
  LAYOUT_WIDTH_FALLBACK_RATIO,
  SENTIMENT_STRIP_HEIGHT,
  WEEKDAY_AVG_FONT,
  WEEKDAY_AVG_LINE_MIN_HEIGHT,
  WEEKDAY_COL_MIN_WIDTH,
  WEEKDAY_EMOJI_SCALE,
  WEEKDAY_LABEL_GAP,
  WEEKDAY_MOJI_FONT,
  WEEKDAY_SHORT_LABEL_FONT,
} from '../moodEmotionInsights.constants';

import type { MoodWeekdaySlice } from '@/entities/lent/model/moodEmotionStats.types';

import Text from '@/shared/ui/Text';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';

const COL_COUNT = 7;

type WeekdayMoodRowProps = {
  contentWidth: number;
  slices: MoodWeekdaySlice[];
};

const buildSentimentWidths = (s: MoodWeekdaySlice) => {
  if (s.sampleSize === 0) {
    return { pos: 0, neu: 100, neg: 0 };
  }
  const pos = Math.round(s.positiveRatio * 1000) / 10;
  const neg = Math.round(s.negativeRatio * 1000) / 10;
  const neu = Math.max(0, Math.round((100 - pos - neg) * 10) / 10);
  return { pos, neu, neg };
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scroll: {
      marginHorizontal: -SPACING.SMALL,
    },
    scrollInner: {
      paddingHorizontal: SPACING.SMALL,
      flexDirection: 'row',
      gap: SPACING.SMALL,
    },
    row: {
      flexDirection: 'row',
      gap: SPACING.SMALL,
    },
    colFlex: {
      flex: 1,
      minWidth: 0,
    },
    label: {
      color: colors.TEXT_SECONDARY,
      marginBottom: WEEKDAY_LABEL_GAP,
      fontSize: WEEKDAY_SHORT_LABEL_FONT,
    },
    colBase: {
      alignItems: 'center',
    },
    emojiWrap: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: WEEKDAY_LABEL_GAP,
    },
    dash: {
      color: colors.TEXT_TERTIARY,
      fontSize: 16,
    },
    strip: {
      width: '100%',
      height: SENTIMENT_STRIP_HEIGHT,
      borderRadius: SENTIMENT_STRIP_HEIGHT / 2,
      flexDirection: 'row',
      overflow: 'hidden',
      marginBottom: WEEKDAY_LABEL_GAP,
    },
    emptyStrip: {
      backgroundColor: colors.GRAY_5,
      width: '100%',
      height: '100%',
    },
    avgWrap: {
      minHeight: WEEKDAY_AVG_LINE_MIN_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avg: {
      color: colors.TEXT_SECONDARY,
      fontSize: WEEKDAY_AVG_FONT,
      textAlign: 'center',
    },
    avgStrong: {
      color: colors.PRIMARY,
      fontWeight: '600',
    },
  });

type WeekdayCellProps = {
  colors: ThemeColors;
  emojiSize: number;
  fixedWidth?: number;
  s: MoodWeekdaySlice;
  styles: ReturnType<typeof createStyles>;
};

const WeekdayCell = ({ colors, emojiSize, fixedWidth, s, styles }: WeekdayCellProps) => {
  const w = buildSentimentWidths(s);
  const rootStyle = [styles.colBase, fixedWidth !== undefined ? { width: fixedWidth } : { width: '100%' as const }];

  return (
    <View style={rootStyle}>
      <Text style={styles.label} variant='body2'>
        {s.shortLabel}
      </Text>
      <View style={[styles.emojiWrap, { minHeight: emojiSize + 6 }]}>
        {s.sampleSize > 0 && s.dominantMoodEmoji ? (
          <Text style={{ fontSize: emojiSize }}>{s.dominantMoodEmoji}</Text>
        ) : (
          <Text style={styles.dash} variant='body2'>
            —
          </Text>
        )}
      </View>
      <View style={styles.strip}>
        {s.sampleSize === 0 ? (
          <View style={styles.emptyStrip} />
        ) : (
          <>
            <View style={{ width: `${w.pos}%`, backgroundColor: colors.SUCCESS }} />
            <View style={{ width: `${w.neu}%`, backgroundColor: colors.GRAY_4 }} />
            <View style={{ width: `${w.neg}%`, backgroundColor: colors.DANGER }} />
          </>
        )}
      </View>
      <View style={styles.avgWrap}>
        {s.sampleSize > 0 ? (
          <Text style={styles.avg} variant='body2'>
            ср. <Text style={styles.avgStrong}>{s.averageScore}</Text>
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const WeekdayMoodRow = ({ contentWidth, slices }: WeekdayMoodRowProps) => {
  const { colors } = useTheme();
  const { width: winW } = useWindowDimensions();
  const styles = createStyles(colors);
  const w = contentWidth > 0 ? contentWidth : Math.max(280, winW * LAYOUT_WIDTH_FALLBACK_RATIO);
  const gap = SPACING.SMALL;
  const innerGaps = gap * (COL_COUNT - 1);
  const colW = (w - innerGaps) / COL_COUNT;
  const needsScroll = colW < WEEKDAY_COL_MIN_WIDTH;
  const refColW = needsScroll ? WEEKDAY_COL_MIN_WIDTH : colW;
  const emojiSize = Math.max(15, Math.min(WEEKDAY_MOJI_FONT, refColW * WEEKDAY_EMOJI_SCALE));

  if (needsScroll) {
    return (
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollInner}
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {slices.map((s) => (
          <WeekdayCell
            colors={colors}
            emojiSize={emojiSize}
            fixedWidth={WEEKDAY_COL_MIN_WIDTH}
            key={s.weekdayIndex}
            s={s}
            styles={styles}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.row}>
      {slices.map((s) => (
        <View key={s.weekdayIndex} style={styles.colFlex}>
          <WeekdayCell colors={colors} emojiSize={emojiSize} s={s} styles={styles} />
        </View>
      ))}
    </View>
  );
};

export default WeekdayMoodRow;
