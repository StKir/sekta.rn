import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { NavigationProp } from '@react-navigation/native';

import BottomSheetManager from '@/shared/ui/BottomSheet/BottomSheetManager';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING, SIZES } from '@/shared/constants';
import { RootStackParamList } from '@/navigation/types';

interface AddRecordContentProps {
  navigation?: NavigationProp<RootStackParamList>;
}

const AddRecordContent = ({ navigation }: AddRecordContentProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleNavigateToCheckIn = () => {
    BottomSheetManager.hide();
    if (navigation) {
      navigation.navigate('CheckInPage');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Новая запись</Text>
      <TouchableOpacity style={styles.option} onPress={handleNavigateToCheckIn}>
        <Text style={styles.optionText}>🐬</Text>
        <Text style={styles.optionText}>Настроение</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: SPACING.LARGE,
    },
    title: {
      fontSize: SIZES.FONT_SIZE.LARGE,
      fontWeight: 'bold',
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.LARGE,
      textAlign: 'left',
    },
    option: {
      borderWidth: 1,
      borderColor: colors.PRIMARY,
      backgroundColor: colors.PRIMARY_ALPHA,
      borderRadius: 12,
      height: 120,
      padding: SPACING.LARGE,
      marginBottom: SPACING.MEDIUM,
      justifyContent: 'flex-end',
    },
    optionText: {
      fontSize: SIZES.FONT_SIZE.XXLARGE,
      color: colors.PRIMARY,
      fontWeight: '400',
    },
  });

export default AddRecordContent;
