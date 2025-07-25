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

  const handleNavigate = (type: 'check-in' | 'moment') => {
    BottomSheetManager.hide();

    if (type === 'check-in') {
      navigation?.navigate('CheckInPage');
    }

    if (type === 'moment') {
      navigation?.navigate('MomentPage');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Новая запись</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => handleNavigate('check-in')}>
          <Text style={styles.optionText}>🐬 Чек-ин</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleNavigate('moment')}>
          <Text style={styles.optionText}>Момент</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    optionsContainer: {
      flexDirection: 'row',
      gap: SPACING.LARGE,
      flexWrap: 'wrap',
      width: '100%',
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
      height: 70,
      padding: SPACING.LARGE,
      marginBottom: SPACING.MEDIUM,
      justifyContent: 'flex-end',
    },
    optionText: {
      fontSize: SIZES.FONT_SIZE.XLARGE,
      color: colors.PRIMARY,
      fontWeight: '400',
    },
  });

export default AddRecordContent;
