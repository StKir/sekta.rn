import Icon from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { AIPost } from '@/types/lentTypes';
import Text from '@/shared/ui/Text';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';
import { RootStackParamList } from '@/navigation/types';

interface Props {
  post: AIPost;
}

const AIWeekAnalysisPostComponent = ({ post }: Props) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Определяем иконку в зависимости от заголовка
  const getIcon = () => {
    if (post.title.toLowerCase().includes('анализ')) {
      return 'analytics-outline';
    } else if (post.title.toLowerCase().includes('вопрос')) {
      return 'chatbubble-outline';
    } else if (post.title.toLowerCase().includes('плейлист')) {
      return 'musical-notes-outline';
    } else {
      return 'sparkles-outline';
    }
  };

  const handlePress = () => {
    navigation.navigate('AIResultPage', { requestId: String(post.id) });
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      <View style={[styles.container, { backgroundColor: colors.BACKGROUND_SECONDARY }]}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <View style={[styles.iconContainer, { backgroundColor: colors.PRIMARY_ALPHA }]}>
              <Icon color={colors.PRIMARY} name={getIcon()} size={24} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title} variant='h3'>
                {post.title}
              </Text>
              <Text style={[styles.subtitle, { color: colors.TEXT_TERTIARY }]} variant='body2'>
                {post.data.status === 'processing' ? 'Обрабатывается...' : 'Готово к просмотру'}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      post.data.status === 'processing' ? colors.WARNING : colors.SUCCESS,
                  },
                ]}
              />
              <Text style={[styles.statusText, { color: colors.TEXT_SECONDARY }]}>
                {post.data.status === 'processing' ? 'Обработка' : 'Готово'}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Text style={[styles.buttonText, { color: colors.PRIMARY }]}>Смотреть</Text>
              <Icon color={colors.PRIMARY} name='chevron-forward' size={16} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contentContainer: {
    padding: SPACING.LARGE,
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.MEDIUM,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MEDIUM,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.MEDIUM,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});

export default AIWeekAnalysisPostComponent;
