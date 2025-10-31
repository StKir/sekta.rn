import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';

import Title from '@/shared/ui/Title/Title';
import Text from '@/shared/ui/Text/Text';
import SimpleRegistrationBottomSheet from '@/shared/ui/SimpleRegistrationBottomSheet';
import Button from '@/shared/ui/Button/Button';
import BottomSheetManager from '@/shared/ui/BottomSheet/BottomSheetManager';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useUser } from '@/shared/hooks/useUser';
import { useSubscription } from '@/shared/hooks/useSubscription';
import { RootStackParamList } from '@/navigation/types';

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

interface PaywallPageProps {}

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

type Nav = StackNavigationProp<RootStackParamList, 'PaywallPage'>;

const PaywallPage: React.FC<PaywallPageProps> = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { activateSubscription, isLoading } = useSubscription();
  const { isAuthenticated } = useUser();
  const [selectedTariff, setSelectedTariff] = useState<string>('3months');
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const onSuccessParam = (route as any)?.params?.onSuccess as (() => void) | undefined;

  // Ensure any open bottom sheets are closed when leaving the page
  useEffect(() => {
    return () => {
      BottomSheetManager.hide();
    };
  }, []);

  const handleSelectTariff = async () => {
    try {
      if (!isAuthenticated) {
        showRegistrationBottomSheet();
        return;
      }

      const success = await activateSubscription(
        selectedTariff as '1month' | '3months' | '1year',
        `payment_${Date.now()}`
      );

      if (success) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        onSuccessParam?.();
        navigation.goBack();
      }
    } catch {
      navigation.goBack();
    }
  };

  const showRegistrationBottomSheet = () => {
    BottomSheetManager.show(
      <SimpleRegistrationBottomSheet
        onClose={() => BottomSheetManager.hide()}
        onComplete={handleRegistrationComplete}
      />,
      {
        snapPoints: ['90%', '100%'],
        detached: false,
      }
    );
  };

  const handleRegistrationComplete = async (_userData: any) => {
    try {
      // Сначала закрываем BottomSheet
      BottomSheetManager.hide();

      // Небольшая задержка, чтобы UI обновился
      await new Promise((resolve) => setTimeout(resolve, 300));

      // После регистрации активируем подписку
      const success = await activateSubscription(
        selectedTariff as '1month' | '3months' | '1year',
        `payment_${Date.now()}`
      );

      if (success) {
        // Еще одна небольшая задержка перед навигацией
        await new Promise((resolve) => setTimeout(resolve, 300));
        onSuccessParam?.();
        navigation.goBack();
      }
    } catch {
      // Если что-то пошло не так, все равно закрываем экран
      navigation.goBack();
    }
  };

  const renderTariffCard = (tariff: TariffOption) => {
    const isSelected = selectedTariff === tariff.id;
    const isPopular = tariff.popular;

    return (
      <TouchableOpacity
        key={tariff.id}
        style={[
          styles.tariffCard,
          isSelected && styles.selectedTariff,
          isPopular && styles.popularTariff,
        ]}
        onPress={() => setSelectedTariff(tariff.id)}
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
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.header}>
          <Button
            style={styles.closeButton}
            textStyle={styles.closeButtonText}
            title='✕'
            variant='text'
            onPress={() => navigation.goBack()}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Title style={styles.title}>Разблокируйте все возможности</Title>
            <Text style={styles.subtitle}>
              Получите персонального AI-ассистента для анализа настроения и рекомендаций
            </Text>
            {!isAuthenticated && (
              <Text style={styles.registrationNote}>
                Для активации подписки необходимо создать аккаунт
              </Text>
            )}
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
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          fullWidth
          loading={isLoading}
          style={styles.continueButton}
          title={isAuthenticated ? 'Активировать подписку' : 'Создать аккаунт и активировать'}
          onPress={handleSelectTariff}
        />
        <Text style={styles.footerText}>
          Подписка продлевается автоматически. Отменить можно в любое время.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 10,
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
    registrationNote: {
      textAlign: 'center',
      color: colors.PRIMARY,
      fontSize: 14,
      fontWeight: '600',
      marginTop: 8,
      paddingHorizontal: 20,
      paddingVertical: 8,
      backgroundColor: colors.PRIMARY + '20',
      borderRadius: 8,
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
      paddingTop: 10,
      backgroundColor: colors.BACKGROUND_PRIMARY,
      borderTopWidth: 1,
      borderTopColor: colors.BORDER,
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

export default PaywallPage;
