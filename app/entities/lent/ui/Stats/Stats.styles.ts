import { StyleSheet } from 'react-native';

import { ThemeColors } from '@/shared/theme/types';
import { SPACING } from '@/shared/constants';

export const styles = (color: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: SPACING.SMALL,
    },
    stat: {
      width: 170,
      height: 90,
      flexDirection: 'column',
      paddingHorizontal: SPACING.MEDIUM,
      justifyContent: 'center',
      gap: SPACING.SMALL,
    },
    lockedStat: {
      flex: 1,
      minWidth: 0,
      height: 90,
      flexDirection: 'column',
      paddingHorizontal: SPACING.MEDIUM,
      justifyContent: 'center',
      gap: SPACING.SMALL,
      alignItems: 'center',
      opacity: 0.45,
    },
    text: { fontSize: 40, fontWeight: 400, lineHeight: 50 },
    power_color: {
      color: color.PRIMARY,
    },
    power_background: {
      borderTopRightRadius: 25,
      borderBottomLeftRadius: 25,
      backgroundColor: color.PRIMARY_ALPHA,
    },
    stress_color: {
      color: color.DANGER,
    },
    stress_background: {
      borderTopRightRadius: 25,
      borderBottomLeftRadius: 25,
      backgroundColor: color.DANGER_ALPHA,
    },
    statFullWidth: {
      width: '100%',
    },
  });
