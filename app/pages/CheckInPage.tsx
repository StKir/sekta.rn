import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import React from 'react';

import Title from '@/shared/ui/Title';

const CheckInPage = () => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <SafeAreaView>
        <Title>Check In</Title>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CheckInPage;
