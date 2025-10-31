import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';

import { SubscriptionBanner, Paywall } from '@/shared/ui';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { useSubscription } from '@/shared/hooks/useSubscription';

const SubscriptionPage: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { activateSubscription, isLoading } = useSubscription();

  const [showPaywall, setShowPaywall] = useState(false);

  const handleBannerPress = () => {
    setShowPaywall(true);
  };

  const handleSelectTariff = async (tariffId: string) => {
    const success = await activateSubscription(
      tariffId as '1month' | '3months' | '1year',
      `payment_${Date.now()}`
    );

    if (success) {
      setShowPaywall(false);
    }
  };

  const handleClosePaywall = () => {
    setShowPaywall(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SubscriptionBanner
          subtitle='Получите персонального AI-ассистента'
          title='Разблокируйте все возможности'
          onPress={handleBannerPress}
        />
      </View>

      {showPaywall && (
        <Paywall
          isLoading={isLoading}
          onClose={handleClosePaywall}
          onSelectTariff={handleSelectTariff}
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
    content: {
      flex: 1,
      paddingTop: 20,
    },
  });

export default SubscriptionPage;
