import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  SharedValue,
} from 'react-native-reanimated';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  InteractionManager,
} from 'react-native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Metrics } from '@/shared/utils/metrics';
import Text from '@/shared/ui/Text/Text';
import Input from '@/shared/ui/Input/Input';
import Button from '@/shared/ui/Button/Button';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useSubscription } from '@/shared/hooks/useSubscription';
import { RootStackParamList } from '@/navigation/types';
import { useUserStore } from '@/entities/user';

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
    price: '349₽',
    description: 'Гибкая подписка на пробу',
    features: ['Все функции', 'Отмена в любой момент'],
  },
  {
    id: '3months',
    title: '3 месяца',
    price: '799₽',
    originalPrice: '999₽',
    discount: '20%',
    description: 'Лучшее предложение для старта',
    features: ['Максимальная выгода'],
    popular: true,
  },
  {
    id: '1year',
    title: '1 год',
    price: '1999₽',
    description: 'Для тех, кто всерьез и надолго',
    features: ['Минимальная цена в месяц'],
  },
];

type Nav = StackNavigationProp<RootStackParamList, 'PaywallPage'>;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type TariffCardProps = {
  tariff: TariffOption;
  isSelected: boolean;
  scale: SharedValue<number>;
  onPress: (tariffId: string) => void;
  styles: ReturnType<typeof createStyles>;
};

const TariffCard: React.FC<TariffCardProps> = ({ tariff, isSelected, scale, onPress, styles }) => {
  const isPopular = tariff.popular;
  const periodLabel =
    tariff.id === '1month'
      ? 'за 1 месяц'
      : tariff.id === '3months'
      ? 'за 3 месяца'
      : 'за 12 месяцев';

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.duration(300).springify().damping(20)}>
      <AnimatedTouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.tariffCard,
          isPopular && styles.popularTariff,
          isSelected && styles.selectedTariff,
          animatedCardStyle,
        ]}
        onPress={() => onPress(tariff.id)}
      >
        <View style={styles.tariffTopRow}>
          <Text style={[styles.tariffTitle, isSelected && styles.selectedText]}>
            {tariff.title}
          </Text>
          {tariff.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{tariff.discount}</Text>
            </View>
          )}
        </View>

        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={[styles.price, isSelected && styles.selectedText]}>{tariff.price}</Text>
            {tariff.originalPrice && (
              <Text style={styles.originalPrice}>{tariff.originalPrice}</Text>
            )}
          </View>
          <Text style={[styles.periodLabel, isSelected && styles.selectedText]}>{periodLabel}</Text>
        </View>

        {tariff.description ? (
          <Text style={[styles.description, isSelected && styles.selectedText]}>
            {tariff.description}
          </Text>
        ) : null}

        {tariff.features?.length ? (
          <View style={styles.tariffFeaturesRow}>
            {tariff.features.map((feature) => (
              <View key={feature} style={styles.tariffFeaturePill}>
                <Text style={styles.tariffFeatureText}>{feature}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {isPopular && (
          <Animated.View
            entering={FadeInDown.duration(300).springify()}
            style={styles.popularBadge}
          >
            <Text style={styles.popularText}>Лучший выбор</Text>
          </Animated.View>
        )}
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
};

const PaywallPage: React.FC<PaywallPageProps> = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { activateSubscription, isLoading, activatePromo } = useSubscription();
  const { tariffInfo, token } = useUserStore();
  const hasTariffInfo = !!tariffInfo;
  const isAuthorized = !!token;

  const [selectedTariff, setSelectedTariff] = useState<'1month' | '3months' | '1year'>('3months');
  const [promoCode, setPromoCode] = useState('');
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const onSuccessParam = (route as any)?.params?.onSuccess as (() => void) | undefined;

  React.useEffect(() => {
    Metrics.paywallOpened();
  }, []);

  const cardScales = {
    '1month': useSharedValue(selectedTariff === '1month' ? 1.04 : 0.98),
    '3months': useSharedValue(selectedTariff === '3months' ? 1.06 : 1),
    '1year': useSharedValue(selectedTariff === '1year' ? 1.04 : 0.98),
  };

  const handleSelectTariff = async () => {
    try {
      if (!hasTariffInfo) {
        navigation.navigate('LoginScreen', { isPaywall: true, duration: selectedTariff });
        return;
      }

      const success = await activateSubscription(
        selectedTariff as '1month' | '3months' | '1year',
        `payment_${Date.now()}`
      );

      if (success) {
        const selectedTariffData = TARIFFS.find((t) => t.id === selectedTariff);
        Metrics.subscriptionPurchased(selectedTariff, selectedTariffData?.price || '');
        await new Promise((resolve) => setTimeout(resolve, 300));
        onSuccessParam?.();
        navigation.goBack();
      }
    } catch {
      navigation.goBack();
    }
  };

  const handleTariffPress = (tariffId: string) => {
    Object.keys(cardScales).forEach((key) => {
      const isCurrent = key === tariffId;
      const baseScale = key === '3months' ? (isCurrent ? 1.08 : 1) : isCurrent ? 1.04 : 0.97;

      cardScales[key as keyof typeof cardScales].value = withSpring(baseScale, {
        damping: 16,
        stiffness: 260,
      });
    });
    setSelectedTariff(tariffId as '1month' | '3months' | '1year');
  };

  const handleActivatePromo = async () => {
    const trimmedPromo = promoCode.trim().toLowerCase();

    if (!trimmedPromo) {
      Alert.alert('Ошибка', 'Введите промокод');
      return;
    }

    if (!isAuthorized) {
      navigation.navigate('LoginScreen', {
        isPaywall: false,
        duration: undefined,
        promo: trimmedPromo,
      });
      return;
    }

    const response = await activatePromo(trimmedPromo);
    InteractionManager.runAfterInteractions(() => {
      if (response) {
        setPromoCode('');
      }

      if (response?.success) {
        navigation.goBack();
      }
    });
  };

  const benefits = [
    { name: 'Подробная статистика', value: '1' },
    { name: 'Чат', value: '2' },
    { name: 'Анализ записей', value: '3' },
    { name: 'Самые новые нейросети', value: '4' },
    { name: 'GPT 5', value: '5' },
    { name: 'gemini 2.5 flash', value: '6' },
    { name: 'DeepSeek', value: '7' },
    { name: 'Grok 4', value: '8' },
  ];

  const featues = [...benefits];

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
          <Animated.View
            entering={FadeInDown.duration(400).springify().damping(20)}
            style={styles.titleContainer}
          >
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>✨</Text>
            </View>
            <Text style={styles.title}>
              Разблокируйте все возможности искусственного интеллекта
            </Text>

            <Text style={styles.modelsText}>Все самые топовые модели</Text>
            <Text style={styles.modelsText}>Неограниченные запросы</Text>

            <View style={styles.modelsContainer}>
              {featues.map((model, index) => (
                <Animated.View
                  entering={FadeInDown.delay(index * 50)
                    .duration(300)
                    .springify()}
                  key={model.value}
                  style={styles.modelItem}
                >
                  <Text style={styles.modelName}>{model.name}</Text>
                </Animated.View>
              ))}
            </View>

            {!hasTariffInfo && (
              <Text style={styles.registrationNote}>
                Для активации подписки необходимо создать аккаунт
              </Text>
            )}
          </Animated.View>

          <View style={styles.tariffsContainer}>
            {TARIFFS.map((tariff) => (
              <TariffCard
                isSelected={selectedTariff === tariff.id}
                key={tariff.id}
                scale={cardScales[tariff.id as keyof typeof cardScales]}
                styles={styles}
                tariff={tariff}
                onPress={handleTariffPress}
              />
            ))}
          </View>

          <View style={styles.promoContainer}>
            <Text style={styles.promoTitle}>Активировать промокод</Text>
            <Input
              autoCapitalize='characters'
              label='Промокод'
              placeholder='Введите промокод'
              value={promoCode.toUpperCase()}
              onChangeText={setPromoCode}
            />
            <Button
              fullWidth
              loading={isLoading}
              style={styles.promoButton}
              title='Применить промокод'
              onPress={handleActivatePromo}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <Button
            fullWidth
            loading={isLoading}
            style={styles.continueButton}
            title={hasTariffInfo ? 'Активировать подписку' : 'Создать аккаунт и активировать'}
            onPress={handleSelectTariff}
          />
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://storage.yandexcloud.net/sekta/offerta.html');
            }}
          >
            <Text style={styles.footerText}>
              Нажимая на кнопку выше вы по соглашаетесь с офертой
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate('TabNavigator')}
          >
            <Text style={styles.skipButtonText}>Не сейчас</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 8,
    },
    closeButton: {
      width: 40,
      height: 40,
    },
    closeButtonText: {
      fontSize: 20,
      color: colors.TEXT_SECONDARY,
    },
    content: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 40,
      paddingTop: 20,
    },
    emojiContainer: {
      marginBottom: 8,
    },
    emoji: {
      fontSize: 120,
      lineHeight: 140,
      padding: 20,
    },
    title: {
      textAlign: 'center',
      marginBottom: 8,
      lineHeight: 32,
      fontSize: 32,
      fontWeight: '700',
    },
    subtitle: {
      textAlign: 'center',
      color: colors.TEXT_PRIMARY,
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 8,
    },
    modelsText: {
      textAlign: 'center',
      color: colors.TEXT_SECONDARY,
      fontSize: 16,
      lineHeight: 24,
      marginTop: 4,
    },
    modelsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 8,
      marginTop: 16,
      marginBottom: 8,
      paddingHorizontal: 8,
    },
    modelItem: {
      backgroundColor: colors.BACKGROUND_SECONDARY,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.BORDER + '40',
    },
    modelName: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    registrationNote: {
      textAlign: 'center',
      color: colors.PRIMARY,
      fontSize: 13,
      fontWeight: '500',
      marginTop: 16,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.PRIMARY + '15',
      borderRadius: 12,
    },
    tariffsContainer: {
      marginBottom: 24,
      gap: 12,
    },
    tariffCard: {
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderWidth: 1.5,
      borderColor: colors.BORDER + '40',
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 3,
    },
    selectedTariff: {
      borderColor: colors.PRIMARY,
      shadowOpacity: 0.14,
      shadowRadius: 14,
      elevation: 5,
    },
    popularTariff: {
      borderColor: colors.PRIMARY,
    },
    popularBadge: {
      position: 'absolute',
      top: -14,
      right: 18,
      backgroundColor: colors.PRIMARY,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 999,
      shadowColor: colors.PRIMARY,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    popularText: {
      color: colors.BACKGROUND_PRIMARY,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    tariffTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    tariffHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    tariffTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    selectedText: {
      color: colors.PRIMARY,
    },
    discountBadge: {
      backgroundColor: colors.PRIMARY,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    discountText: {
      color: colors.BACKGROUND_PRIMARY,
      fontSize: 11,
      fontWeight: '700',
    },
    priceSection: {
      marginBottom: 10,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 8,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 8,
      gap: 8,
    },
    price: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      letterSpacing: -0.5,
    },
    originalPrice: {
      fontSize: 18,
      color: colors.TEXT_SECONDARY,
      textDecorationLine: 'line-through',
      fontWeight: '500',
    },
    description: {
      fontSize: 15,
      color: colors.TEXT_SECONDARY,
      marginTop: 6,
      marginBottom: 8,
    },
    periodLabel: {
      fontSize: 13,
      color: colors.TEXT_SECONDARY,
      marginTop: 2,
    },
    tariffFeaturesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 2,
    },
    tariffFeaturePill: {
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    tariffFeatureText: {
      fontSize: 12,
      color: colors.TEXT_PRIMARY,
      fontWeight: '500',
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
      paddingHorizontal: 24,
      paddingBottom: 24,
      paddingTop: 16,
      backgroundColor: colors.BACKGROUND_PRIMARY,
      borderTopWidth: 1,
      borderTopColor: colors.BORDER + '40',
    },
    continueButton: {
      marginBottom: 12,
    },
    footerText: {
      textAlign: 'center',
      fontSize: 14,
      color: colors.PRIMARY,
      lineHeight: 16,
      marginBottom: 16,
    },
    skipButton: {
      paddingVertical: 12,
      alignItems: 'center',
    },
    skipButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.TEXT_SECONDARY,
    },
    promoContainer: {
      marginBottom: 24,
      padding: 20,
      borderRadius: 16,
      backgroundColor: colors.BACKGROUND_SECONDARY,
      gap: 12,
    },
    promoTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    promoButton: {
      marginTop: 8,
    },
  });

export default PaywallPage;
