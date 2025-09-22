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

const options: OptionType[] = [
  {
    title: 'Эмоциональный чек-ин',
    type: 'check-in',
  },
  {
    title: 'Заметка',
    type: 'note',
  },
  {
    title: 'Момент',
    type: 'moment',
  },
];

type OptionType = { type: 'check-in' | 'moment' | 'note'; title: string };

const AddRecordContent = ({ navigation }: AddRecordContentProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleNavigate = (type: 'check-in' | 'moment' | 'note') => {
    BottomSheetManager.hide();

    if (type === 'check-in') {
      navigation?.navigate('CheckInPage');
    }

    if (type === 'moment') {
      navigation?.navigate('MomentPage');
    }

    if (type === 'note') {
      navigation?.navigate('NotePage');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Новая запись</Text>
      <View style={styles.optionsContainer}>
        {options.map((option, i) => (
          <TouchableOpacity
            key={i}
            style={styles.option}
            onPress={() => handleNavigate(option.type)}
          >
            <Text style={styles.optionText}>{option.title}</Text>
          </TouchableOpacity>
        ))}
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
      justifyContent: 'center',
      gap: SPACING.LARGE,
      flexWrap: 'wrap',
      width: '100%',
    },
    title: {
      fontSize: SIZES.FONT_SIZE.LARGE,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.LARGE,
    },
    option: {
      borderWidth: 1,
      borderColor: colors.PRIMARY,
      backgroundColor: colors.PRIMARY_ALPHA,
      borderRadius: 12,
      height: 70,
      padding: SPACING.LARGE,
      marginBottom: SPACING.MEDIUM,
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionText: {
      fontSize: SIZES.FONT_SIZE.XLARGE,
      color: colors.PRIMARY,
      fontWeight: '400',
    },
  });

export default AddRecordContent;
