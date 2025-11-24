import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  SharedValue,
} from 'react-native-reanimated';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AIModel } from '@/types/aiTypes';
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
    price: '349₽',
    description: 'Попробуйте все возможности',
    features: [],
  },
  {
    id: '3months',
    title: '3 месяца',
    price: '799₽',
    originalPrice: '999₽',
    discount: '20%',
    description: 'Лучшее предложение',
    features: [],
    popular: true,
  },
  {
    id: '1year',
    title: '1 год',
    price: '1999₽',
    description: 'Максимальная экономия',
    features: [],
  },
];

const AI_MODELS = [
  { name: 'GPT-5', value: AIModel.GPT_5 },
  { name: 'GPT-4.1', value: AIModel.GPT_4_1 },
  { name: 'GPT-4o', value: AIModel.GPT_4o },
  { name: 'Grok-4', value: AIModel.GROK_4 },
  { name: 'DeepSeek R1', value: AIModel.DEEPSEEK_R1 },
  { name: 'DeepSeek V3', value: AIModel.DEEPSEEK_V3 },
  { name: 'Claude 3.7 Sonnet', value: AIModel.CLAUDE_3_7_SONNET },
  { name: 'Gemini 2.5 Flash', value: AIModel.GEMINI_2_5_FLASH },
  { name: 'Gemini 2.5 Flash Lite', value: AIModel.GEMINI_2_5_FLASH_LITE },
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

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.duration(300).springify().damping(20)}>
      <AnimatedTouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.tariffCard,
          isSelected && styles.selectedTariff,
          isPopular && styles.popularTariff,
          animatedCardStyle,
        ]}
        onPress={() => onPress(tariff.id)}
      >
        {isPopular && (
          <Animated.View
            entering={FadeInDown.duration(300).springify()}
            style={styles.popularBadge}
          >
            <Text style={styles.popularText}>Популярный</Text>
          </Animated.View>
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

        {tariff.description && (
          <Text style={[styles.description, isSelected && styles.selectedText]}>
            {tariff.description}
          </Text>
        )}
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
};

const PaywallPage: React.FC<PaywallPageProps> = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { activateSubscription, isLoading } = useSubscription();
  const { isAuthenticated } = useUser();
  const [selectedTariff, setSelectedTariff] = useState<string>('3months');
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const onSuccessParam = (route as any)?.params?.onSuccess as (() => void) | undefined;

  const cardScales = {
    '1month': useSharedValue(1),
    '3months': useSharedValue(1),
    '1year': useSharedValue(1),
  };

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

  const handleTariffPress = (tariffId: string) => {
    Object.keys(cardScales).forEach((key) => {
      if (key === tariffId) {
        cardScales[key as keyof typeof cardScales].value = withSpring(0.95, {
          damping: 15,
          stiffness: 300,
        });
        setTimeout(() => {
          cardScales[key as keyof typeof cardScales].value = withSpring(1, {
            damping: 15,
            stiffness: 300,
          });
        }, 100);
      }
    });
    setSelectedTariff(tariffId);
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
              {AI_MODELS.map((model, index) => (
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

            {!isAuthenticated && (
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
        </View>
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
      gap: 16,
    },
    tariffCard: {
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderRadius: 24,
      padding: 24,
      borderWidth: 2,
      borderColor: 'transparent',
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    selectedTariff: {
      borderColor: colors.PRIMARY,
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    popularTariff: {
      borderColor: colors.DANGER_ALPHA,
    },
    popularBadge: {
      position: 'absolute',
      top: -10,
      right: 24,
      backgroundColor: colors.PRIMARY,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 16,
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
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
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
      marginTop: 4,
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
      fontSize: 11,
      color: colors.TEXT_SECONDARY,
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
  });

export default PaywallPage;
