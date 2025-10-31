import { View, StyleSheet } from 'react-native';
import React from 'react';

import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import RegistrationStep from '@/features/forms/DynamicForm/RegistrationStep';

interface RegistrationBottomSheetProps {
  onComplete: (userData: any) => void;
  onClose: () => void;
}

const RegistrationBottomSheet: React.FC<RegistrationBottomSheetProps> = ({
  onComplete,
  onClose,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <RegistrationStep onComplete={onComplete} onNext={onClose} />
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.BACKGROUND_PRIMARY,
    },
  });

export default RegistrationBottomSheet;
