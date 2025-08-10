import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import Text from '@/shared/ui/Text';
import MainContainer from '@/shared/ui/Container/MainContainer';
import { Button, FormattedText } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useGetAIPost } from '@/shared/hooks/useGetAIPost';
import { SPACING } from '@/shared/constants';
import { RootStackParamList } from '@/navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AIResultPage = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { requestId } = useRoute<RouteProp<RootStackParamList, 'AIResultPage'>>().params;
  const navigation = useNavigation<NavigationProp>();

  const { post: updatedPost, isPolling, isError } = useGetAIPost(Number(requestId));

  if (isError) {
    return (
      <View style={styles.center}>
        <Icon color={colors.DANGER} name='alert-circle' size={43} />
        <Text
          color={colors.TEXT_SECONDARY}
          style={{ textAlign: 'center', marginTop: SPACING.MEDIUM }}
        >
          Произошла ошибка при получении результата
        </Text>
        <Button sticky title='Назад' variant='primary' onPress={navigation.goBack} />
      </View>
    );
  }

  if (isPolling) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.TEXT_SECONDARY, marginBottom: SPACING.MEDIUM }}>
          Получаем результат...
        </Text>
        <ActivityIndicator color={colors.PRIMARY} size='large' />
        <Button sticky title='Назад' variant='primary' onPress={navigation.goBack} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MainContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <FormattedText>{updatedPost?.data.result || ''}</FormattedText>
          <Button fullWidth title='Назад' variant='primary' onPress={navigation.goBack} />
        </ScrollView>
      </MainContainer>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: SPACING.LARGE,
      paddingBottom: SPACING.XLARGE,
    },
    pageTitle: {
      color: colors.TEXT_PRIMARY,
      textAlign: 'left',
      fontSize: 18,
      marginBottom: SPACING.MEDIUM,
    },
    description: {
      color: colors.TEXT_SECONDARY,
      marginBottom: SPACING.LARGE,
      lineHeight: 22,
    },
    inputContainer: {
      flex: 1,
      marginBottom: SPACING.LARGE,
    },
    questionInput: {
      minHeight: 200,
      textAlignVertical: 'top',
    },
    bottomContainer: {
      paddingHorizontal: SPACING.LARGE,
      paddingBottom: SPACING.LARGE,
      paddingTop: SPACING.MEDIUM,
      backgroundColor: colors.BACKGROUND_PRIMARY,
      borderTopWidth: 1,
      borderTopColor: colors.BORDER,
    },
  });

export default AIResultPage;
