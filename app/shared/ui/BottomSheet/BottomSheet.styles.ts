import { StyleSheet } from 'react-native';

import { SPACING } from '@/shared/constants';

export const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(255, 246, 246, 0.5)',
    opacity: 1,
    position: 'absolute',
    top: 0,
    height: '100%',
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    padding: SPACING.MEDIUM,
  },
});
