import { StyleSheet, View, FlatList } from 'react-native';
import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';

import Text from '@/shared/ui/Text';
import { Button } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { useDaysPosts } from '@/shared/hooks/useDaysPosts';
import { SPACING } from '@/shared/constants';
import { RootStackParamList } from '@/navigation/types';
import { weekAnalysisPrompt } from '@/entities/assiatent/promts';

type NavigationProp = StackNavigationProp<RootStackParamList>;

type AIBlock = {
  id: string;
  title: string;
  description: string;
  action: () => void;
};

const AIPage = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<NavigationProp>();
  const { postsData } = useDaysPosts(7);
  const user = useUser();

  const aiBlocks: AIBlock[] = [
    {
      id: '1',
      title: 'Анализ недели',
      description:
        'Мы отправим в нейросеть контекст вашей недели и вы получите ценные советы и рекомендации по стабилизации эмоционального состояния',
      action: () => {
        const prompt = weekAnalysisPrompt({ ...postsData }, user.userData || {});

        Clipboard.setString(prompt);
        console.log(prompt);
      },
    },
    {
      id: '2',
      title: 'Задать вопрос',
      description:
        'Задайте любой вопрос нашему AI-психологу и получите персональную консультацию на основе анализа ваших записей',
      action: () => {
        navigation.navigate('AIQuestionPage');
      },
    },
  ];

  const renderAIBlock = ({ item }: { item: AIBlock }) => (
    <View style={styles.blockContainer}>
      <Text style={styles.blockTitle} variant='h3'>
        {item.title}
      </Text>
      <Text style={styles.blockDescription} variant='body2'>
        {item.description}
      </Text>
      <Button fullWidth title='Начать' variant='outline' onPress={item.action} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle} variant='h2'>
        AI Помощник
      </Text>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={aiBlocks}
        keyExtractor={(item) => item.id}
        renderItem={renderAIBlock}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
      paddingHorizontal: SPACING.LARGE,
    },
    pageTitle: {
      color: colors.TEXT_PRIMARY,
      textAlign: 'left',
      marginBottom: SPACING.LARGE,
    },
    listContainer: {
      paddingBottom: SPACING.LARGE,
    },
    blockContainer: {
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderRadius: 25,
      padding: SPACING.LARGE,
      marginBottom: SPACING.MEDIUM,
      borderWidth: 1,
      borderColor: colors.BORDER,
    },
    blockTitle: {
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.SMALL,
    },
    blockDescription: {
      color: colors.TEXT_SECONDARY,
      marginBottom: SPACING.LARGE,
      lineHeight: 22,
    },
  });

export default AIPage;
