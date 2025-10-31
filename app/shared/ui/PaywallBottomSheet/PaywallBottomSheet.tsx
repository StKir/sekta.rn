import { View, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';

import Button from '../Button/Button';

import Title from '@/shared/ui/Title/Title';
import Text from '@/shared/ui/Text/Text';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';

export interface TariffOption {
  id: '1month' | '3months' | '1year';
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface PaywallBottomSheetProps {
  onSelectTariff: (tariffId: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const TARIFFS: TariffOption[] = [
  {
    id: '1month',
    title: '1 месяц',
    price: '299₽',
    description: 'Попробуйте все возможности',
    features: ['Неограниченный доступ к AI', 'Персональные рекомендации', 'Анализ настроения'],
  },
  {
    id: '3months',
    title: '3 месяца',
    price: '699₽',
    originalPrice: '897₽',
    discount: '22%',
    description: 'Лучшее предложение',
    features: ['Все функции PRO', 'Экономия 22%', 'Приоритетная поддержка'],
    popular: true,
  },
  {
    id: '1year',
    title: '1 год',
    price: '1999₽',
    originalPrice: '3588₽',
    discount: '44%',
    description: 'Максимальная экономия',
    features: [
      'Все функции PRO',
      'Экономия 44%',
      'VIP поддержка',
      'Ранний доступ к новым функциям',
    ],
  },
];

const PaywallBottomSheet: React.FC<PaywallBottomSheetProps> = ({
  onSelectTariff,
  onClose,
  isLoading = false,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [selectedTariff] = useState<string>('3months');

  const handleSelectTariff = () => {
    onSelectTariff(selectedTariff);
  };

  const renderTariffCard = (tariff: TariffOption) => {
    const isSelected = selectedTariff === tariff.id;
    const isPopular = tariff.popular;

    return (
      <View
        key={tariff.id}
        style={[
          styles.tariffCard,
          isSelected && styles.selectedTariff,
          isPopular && styles.popularTariff,
        ]}
      >
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Популярный</Text>
          </View>
        )}

        <View style={styles.tariffHeader}>
          <Text style={[styles.tariffTitle, isSelected && styles.selectedText]}>
            {tariff.title}
          </Text>
          {tariff.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{tariff.discount}</Text>
            </View>
          )}
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.price, isSelected && styles.selectedText]}>{tariff.price}</Text>
          {tariff.originalPrice && <Text style={styles.originalPrice}>{tariff.originalPrice}</Text>}
        </View>

        <Text style={[styles.description, isSelected && styles.selectedText]}>
          {tariff.description}
        </Text>

        <View style={styles.featuresContainer}>
          {tariff.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={[styles.featureText, isSelected && styles.selectedText]}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          style={styles.closeButton}
          textStyle={styles.closeButtonText}
          title='✕'
          variant='text'
          onPress={onClose}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.content}
      >
        <View style={styles.titleContainer}>
          <Title style={styles.title}>Разблокируйте все возможности</Title>
          <Text style={styles.subtitle}>
            Получите персонального AI-ассистента для анализа настроения и рекомендаций
          </Text>
        </View>

        <View style={styles.tariffsContainer}>{TARIFFS.map(renderTariffCard)}</View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Что вы получите:</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🧠</Text>
            <Text style={styles.benefitText}>AI-анализ вашего настроения и эмоций</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📊</Text>
            <Text style={styles.benefitText}>Персональные рекомендации и советы</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📈</Text>
            <Text style={styles.benefitText}>Детальная статистика и тренды</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🎯</Text>
            <Text style={styles.benefitText}>Помощь в достижении целей</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          loading={isLoading}
          style={styles.continueButton}
          title='Продолжить'
          onPress={handleSelectTariff}
        />
        <Text style={styles.footerText}>
          Подписка продлевается автоматически. Отменить можно в любое время.
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    closeButton: {
      width: 40,
      height: 40,
    },
    closeButtonText: {
      fontSize: 18,
      color: colors.TEXT_SECONDARY,
    },
    content: {
      width: 1000,
      height: '100%',
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      minHeight: 600,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      textAlign: 'center',
      color: colors.TEXT_SECONDARY,
      fontSize: 16,
      lineHeight: 22,
    },
    tariffsContainer: {
      marginBottom: 30,
    },
    tariffCard: {
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: 'transparent',
      position: 'relative',
    },
    selectedTariff: {
      borderColor: colors.PRIMARY,
      backgroundColor: colors.PRIMARY + '10',
    },
    popularTariff: {
      borderColor: colors.PRIMARY,
    },
    popularBadge: {
      position: 'absolute',
      top: -8,
      right: 20,
      backgroundColor: colors.PRIMARY,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    popularText: {
      color: colors.BACKGROUND_PRIMARY,
      fontSize: 12,
      fontWeight: '600',
    },
    tariffHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    tariffTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    selectedText: {
      color: colors.PRIMARY,
    },
    discountBadge: {
      backgroundColor: colors.PRIMARY,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    discountText: {
      color: colors.BACKGROUND_PRIMARY,
      fontSize: 12,
      fontWeight: '600',
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 8,
    },
    price: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },
    originalPrice: {
      fontSize: 16,
      color: colors.TEXT_SECONDARY,
      textDecorationLine: 'line-through',
      marginLeft: 8,
    },
    description: {
      fontSize: 14,
      color: colors.TEXT_SECONDARY,
      marginBottom: 16,
    },
    featuresContainer: {
      gap: 8,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    featureIcon: {
      color: colors.PRIMARY,
      fontSize: 16,
      marginRight: 8,
    },
    featureText: {
      fontSize: 14,
      color: colors.TEXT_PRIMARY,
      flex: 1,
    },
    benefitsContainer: {
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    },
    benefitsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
      marginBottom: 16,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    benefitIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    benefitText: {
      fontSize: 14,
      color: colors.TEXT_PRIMARY,
      flex: 1,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    continueButton: {
      marginBottom: 12,
    },
    footerText: {
      textAlign: 'center',
      fontSize: 12,
      color: colors.TEXT_SECONDARY,
      lineHeight: 16,
    },
  });

export default PaywallBottomSheet;
