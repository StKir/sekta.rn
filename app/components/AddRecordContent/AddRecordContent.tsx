import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import React from 'react';

import BottomSheetManager from '@/shared/ui/BottomSheet/BottomSheetManager';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING, SIZES } from '@/shared/constants';

const AddRecordContent = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Новая запись</Text>
      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          BottomSheetManager.hide();
          console.log('Mood pressed');
        }}
      >
        <Text style={styles.optionText}>Настроение</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          BottomSheetManager.hide();
          console.log('Thoughts pressed');
        }}
      >
        <Text style={styles.optionText}>Мысли</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          BottomSheetManager.hide();
          console.log('Thoughts pressed');
        }}
      >
        <Text style={styles.optionText}>Мысли</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          BottomSheetManager.hide();
          console.log('Thoughts pressed');
        }}
      >
        <Text style={styles.optionText}>Мысли</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          BottomSheetManager.hide();
          console.log('Thoughts pressed');
        }}
      >
        <Text style={styles.optionText}>Мысли</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          BottomSheetManager.hide();
          console.log('Thoughts pressed');
        }}
      >
        <Text style={styles.optionText}>Мысли</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          BottomSheetManager.hide();
          console.log('Thoughts pressed');
        }}
      >
        <Text style={styles.optionText}>Мысли</Text>
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
      textAlign: 'center',
    },
    option: {
      backgroundColor: colors.BACKGROUND_SECONDARY,
      borderRadius: 12,
      padding: SPACING.LARGE,
      marginBottom: SPACING.MEDIUM,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.SEPARATOR,
    },
    optionText: {
      fontSize: SIZES.FONT_SIZE.MEDIUM,
      color: colors.TEXT_PRIMARY,
      fontWeight: '600',
    },
  });

export default AddRecordContent;
