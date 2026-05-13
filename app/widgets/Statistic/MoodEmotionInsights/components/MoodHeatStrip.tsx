/* eslint-disable react-native/no-unused-styles */
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import React, { useEffect, useRef } from 'react';

import {
  HEAT_CELL_GAP,
  HEAT_CELL_HEIGHT,
  HEAT_CELL_HEIGHT_COMPACT,
  HEAT_CELL_MIN_WIDTH,
  HEAT_CELL_RADIUS,
  HEAT_DAY_LABEL_OFFSET,
  HEAT_DAY_NUM_FONT,
  HEAT_EMOJI_IN_CELL,
  HEAT_EMOJI_SCALE,
  LAYOUT_WIDTH_FALLBACK_RATIO,
} from '../moodEmotionInsights.constants';

import type { MoodDayCell } from '@/entities/lent/model/moodEmotionStats.types';

import Text from '@/shared/ui/Text';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';

type MoodHeatStripProps = {
  cells: MoodDayCell[];
  contentWidth: number;
};

const cellColor = (score: number | null, colors: ThemeColors) => {
  if (score === null) {
    return colors.GRAY_5;
  }
  if (score <= 1) {
    return colors.DANGER;
  }
  if (score === 2) {
    return colors.WARNING;
  }
  if (score === 3) {
    return colors.GRAY_3;
  }
  if (score === 4) {
    return colors.TEAL;
  }
  return colors.SUCCESS;
};

const createStyles = (colors: ThemeColors, blockHeight: number) =>
  StyleSheet.create({
    scroll: {
      marginHorizontal: -SPACING.SMALL,
    },
    contentRow: {
      flexDirection: 'row',
      gap: HEAT_CELL_GAP,
      width: '100%',
    },
    contentScroll: {
      paddingHorizontal: SPACING.SMALL,
      flexDirection: 'row',
      gap: HEAT_CELL_GAP,
      alignItems: 'flex-end',
    },
    cell: {
      alignItems: 'center',
    },
    cellFlex: {
      flex: 1,
      minWidth: HEAT_CELL_MIN_WIDTH,
      alignItems: 'center',
    },
    block: {
      width: '100%',
      height: blockHeight,
      borderRadius: HEAT_CELL_RADIUS,
      marginBottom: HEAT_DAY_LABEL_OFFSET,
      borderWidth: 1,
      borderColor: colors.BORDER,
      justifyContent: 'center',
      alignItems: 'center',
    },
    blockFixed: {
      borderRadius: HEAT_CELL_RADIUS,
      marginBottom: HEAT_DAY_LABEL_OFFSET,
      borderWidth: 1,
      borderColor: colors.BORDER,
      justifyContent: 'center',
      alignItems: 'center',
    },
    day: {
      color: colors.TEXT_SECONDARY,
      fontSize: HEAT_DAY_NUM_FONT,
      fontWeight: '600',
    },
  });

const MoodHeatStrip = ({ cells, contentWidth }: MoodHeatStripProps) => {
  const { colors } = useTheme();
  const { width: winW } = useWindowDimensions();
  const ref = useRef<ScrollView>(null);
  const w = contentWidth > 0 ? contentWidth : Math.max(280, winW * LAYOUT_WIDTH_FALLBACK_RATIO);
  const n = cells.length;
  const gaps = n > 1 ? HEAT_CELL_GAP * (n - 1) : 0;
  const colW = n > 0 ? (w - gaps) / n : 0;
  const needsScroll = n > 0 && colW < HEAT_CELL_MIN_WIDTH;
  const fixedW = needsScroll ? HEAT_CELL_MIN_WIDTH : 0;
  const blockHeight = needsScroll ? HEAT_CELL_HEIGHT_COMPACT : HEAT_CELL_HEIGHT;
  const emojiSize = Math.max(
    14,
    Math.min(HEAT_EMOJI_IN_CELL, (needsScroll ? fixedW : colW) * HEAT_EMOJI_SCALE)
  );
  const styles = createStyles(colors, blockHeight);

  useEffect(() => {
    const t = setTimeout(() => {
      ref.current?.scrollToEnd({ animated: true });
    }, 80);
    return () => clearTimeout(t);
  }, [cells.length]);

  const renderCell = (c: MoodDayCell, layout: 'flex' | 'fixed') => {
    const bg = cellColor(c.score, colors);
    const emoji = c.moodLabel ? c.moodLabel.trim().slice(0, 2) : '';
    const wrapStyle = layout === 'flex' ? styles.cellFlex : [styles.cell, { width: fixedW }];
    const blockStyle =
      layout === 'flex'
        ? [styles.block, { backgroundColor: bg }]
        : [styles.blockFixed, { width: fixedW, height: blockHeight, backgroundColor: bg }];

    return (
      <View key={String(c.date.getTime())} style={wrapStyle}>
        <View style={blockStyle}>{emoji ? <Text style={{ fontSize: emojiSize }}>{emoji}</Text> : null}</View>
        <Text style={styles.day} variant='body2'>
          {c.dayOfMonth}
        </Text>
      </View>
    );
  };

  if (needsScroll) {
    return (
      <ScrollView
        horizontal
        contentContainerStyle={styles.contentScroll}
        ref={ref}
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {cells.map((c) => renderCell(c, 'fixed'))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.contentRow}>
      {cells.map((c) => renderCell(c, 'flex'))}
    </View>
  );
};

export default MoodHeatStrip;
