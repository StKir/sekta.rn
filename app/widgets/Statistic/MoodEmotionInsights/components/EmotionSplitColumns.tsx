/* eslint-disable react-native/no-unused-styles */
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import React from 'react';

import {
  EMOTION_BAR_HEIGHT,
  EMOTION_LABEL_ROW_BOTTOM,
  EMOTION_ROW_GAP,
  EMOTION_STACK_BREAKPOINT,
  LAYOUT_WIDTH_FALLBACK_RATIO,
} from '../moodEmotionInsights.constants';

import type { EmotionFrequencyRow } from '@/entities/lent/model/moodEmotionStats.types';

import Text from '@/shared/ui/Text';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';

type EmotionSplitColumnsProps = {
  contentWidth: number;
  weekdayRows: EmotionFrequencyRow[];
  weekendRows: EmotionFrequencyRow[];
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: SPACING.MEDIUM,
    },
    stack: {
      flexDirection: 'column',
      gap: SPACING.MEDIUM,
    },
    col: {
      flex: 1,
      minWidth: 0,
      backgroundColor: colors.SURFACE,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.BORDER,
      padding: SPACING.MEDIUM,
    },
    colFull: {
      width: '100%',
      flex: 0,
    },
    colTitle: {
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.MEDIUM,
      fontWeight: '700',
    },
    empty: {
      color: colors.TEXT_TERTIARY,
    },
    line: {
      marginBottom: EMOTION_ROW_GAP,
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: EMOTION_LABEL_ROW_BOTTOM,
      gap: SPACING.SMALL,
    },
    label: {
      color: colors.TEXT_PRIMARY,
      flex: 1,
      minWidth: 0,
    },
    pct: {
      color: colors.TEXT_SECONDARY,
      flexShrink: 0,
    },
    track: {
      height: EMOTION_BAR_HEIGHT,
      borderRadius: EMOTION_BAR_HEIGHT / 2,
      backgroundColor: colors.GRAY_5,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: EMOTION_BAR_HEIGHT / 2,
    },
  });

const EmotionColumn = ({
  accent,
  rows,
  stacked,
  styles,
  title,
}: {
  accent: string;
  rows: EmotionFrequencyRow[];
  stacked: boolean;
  styles: ReturnType<typeof createStyles>;
  title: string;
}) => (
  <View style={[styles.col, stacked && styles.colFull]}>
    <Text style={styles.colTitle} variant='body1'>
      {title}
    </Text>
    {rows.length === 0 ? (
      <Text style={styles.empty} variant='body2'>
        Нет данных
      </Text>
    ) : (
      rows.map((r) => (
        <View key={r.label} style={styles.line}>
          <View style={styles.labelRow}>
            <Text numberOfLines={2} style={styles.label} variant='body2'>
              {r.label}
            </Text>
            <Text style={styles.pct} variant='body2'>
              {Math.round(r.ratio * 100)}%
            </Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.round(r.ratio * 100)}%`, backgroundColor: accent }]} />
          </View>
        </View>
      ))
    )}
  </View>
);

const EmotionSplitColumns = ({ contentWidth, weekdayRows, weekendRows }: EmotionSplitColumnsProps) => {
  const { colors } = useTheme();
  const { width: winW } = useWindowDimensions();
  const styles = createStyles(colors);
  const w = contentWidth > 0 ? contentWidth : Math.max(280, winW * LAYOUT_WIDTH_FALLBACK_RATIO);
  const stack = w < EMOTION_STACK_BREAKPOINT;

  return (
    <View style={stack ? styles.stack : styles.row}>
      <EmotionColumn accent={colors.PRIMARY} rows={weekdayRows} stacked={stack} styles={styles} title='Будни' />
      <EmotionColumn accent={colors.TEAL} rows={weekendRows} stacked={stack} styles={styles} title='Выходные' />
    </View>
  );
};

export default EmotionSplitColumns;
