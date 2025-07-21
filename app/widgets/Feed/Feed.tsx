import { FlatList, View, Text, StyleSheet } from 'react-native';
import React from 'react';

import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';
import Post from '@/features/lent/Post';
import { useLentStore } from '@/entities/lent/store/store';

const Feed = () => {
  const { posts } = useLentStore();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Пока нет записей</Text>
        <Text style={styles.emptySubtext}>Начните с создания первой записи</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ gap: SPACING.LARGE }}
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      ListFooterComponent={<View style={{ height: 100 }} />}
      renderItem={({ item }) => <Post key={item.id} post={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SPACING.LARGE,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.SMALL,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.TEXT_SECONDARY,
      textAlign: 'center',
    },
  });

export default Feed;
