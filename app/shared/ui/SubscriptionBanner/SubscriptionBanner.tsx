import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

import Text from '@/shared/ui/Text/Text';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useAppNavigation } from '@/shared/hooks/useAppNavigation';

interface SubscriptionBannerProps {
  title?: string;
  subtitle?: string;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  title = 'Разблокируйте все возможности',
  subtitle = 'Получите персонального AI-ассистента',
}) => {
  const navigation = useAppNavigation();
  const showPaywall = () => {
    navigation.navigate('PaywallPage', {
      onSuccess: () => {
        console.log('Подписка активирована!');
      },
    });
  };
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.container} onPress={showPaywall}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✨</Text>
        </View>
      </View>
      <View style={styles.gradient} />
    </TouchableOpacity>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginVertical: 10,
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.PRIMARY,
      minHeight: 80,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: '#fff',
      opacity: 0.9,
    },
    iconContainer: {
      marginLeft: 16,
    },
    icon: {
      fontSize: 24,
    },
    gradient: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 60,
      height: '100%',
      backgroundColor: colors.PRIMARY,
      opacity: 0.2,
    },
  });

export default SubscriptionBanner;
