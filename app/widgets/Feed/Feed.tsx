import { FlatList, View, StyleSheet } from 'react-native';
import React from 'react';

import Text from '@/shared/ui/Text';
import { BottomSheetManager } from '@/shared/ui/BottomSheet';
import { Button } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useAppNavigation } from '@/shared/hooks/useAppNavigation';
import { SPACING } from '@/shared/constants';
import DateWrapper from '@/features/lent/components/DateWrapper/DateWrapper';
import Post from '@/features/lent/Post';
import AddRecordContent from '@/features/forms/AddRecordContent/AddRecordContent';
import { useLentStore } from '@/entities/lent/store/store';

const Feed = () => {
  const { posts } = useLentStore();
  const navigation = useAppNavigation();

  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Пока нет записей</Text>
        <Text style={styles.emptySubtext}>Начните с создания первой записи</Text>
        <Text.Body1 style={{ fontSize: 40, lineHeight: 40 }}>⬇</Text.Body1>

        <Button
          fullWidth
          icon='add-circle-outline'
          style={{ marginTop: 20, height: 70 }}
          title='Добавить запись'
          variant='primary'
          onPress={() => navigation?.navigate('CheckInPage')}
        />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{
        gap: 25,
      }}
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      ListFooterComponent={<View style={{ height: 100 }} />}
      ListHeaderComponent={
        <Button
          fullWidth
          icon='add-circle-outline'
          style={{ marginTop: 20, height: 70 }}
          title='Добавить запись'
          variant='outline'
          onPress={() => {
            BottomSheetManager.show(<AddRecordContent navigation={navigation} />, {
              snapPoints: ['40%', '90%'],
              detached: true,
            });
          }}
        />
      }
      renderItem={({ item }) => (
        <DateWrapper date={item.date}>
          <Post post={item} />
        </DateWrapper>
      )}
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
