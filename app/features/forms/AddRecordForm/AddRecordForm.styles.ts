import { StyleSheet } from 'react-native';

import { ThemeColors } from '@/shared/theme/types';
import { SPACING } from '@/shared/constants';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: SPACING.MEDIUM,
    },
    header: {
      marginBottom: SPACING.LARGE,
      alignItems: 'center',
    },
    title: {
      marginBottom: SPACING.SMALL,
    },
    input: {
      marginBottom: SPACING.MEDIUM,
    },
    existingTagsSection: {
      marginBottom: SPACING.MEDIUM,
    },
    sectionTitle: {
      marginBottom: SPACING.SMALL,
      fontSize: 14,
      fontWeight: '600',
      color: colors.TEXT_SECONDARY,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.SMALL,
      marginBottom: SPACING.MEDIUM,
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 12,
      paddingRight: 8,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.PRIMARY,
      backgroundColor: colors.BACKGROUND_SECONDARY,
      gap: 6,
    },
    selectedTag: {
      backgroundColor: colors.PRIMARY,
    },
    tagText: {
      fontSize: 12,
      color: colors.TEXT_PRIMARY,
    },
    selectedTagText: {
      color: colors.BACKGROUND_PRIMARY,
    },
    deleteButton: {
      padding: 2,
      borderRadius: 8,
    },
    emptyTagsText: {
      fontSize: 12,
      color: colors.TEXT_SECONDARY,
      fontStyle: 'italic',
      textAlign: 'center',
      paddingVertical: SPACING.SMALL,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: SPACING.SMALL,
      marginTop: 'auto',
      paddingTop: SPACING.MEDIUM,
    },
    button: {
      flex: 1,
    },
  });
