import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useMemo, useEffect, useState } from 'react';

import Text from '@/shared/ui/Text/Text';
import BottomSheetManager from '@/shared/ui/BottomSheet/BottomSheetManager';
import { typography } from '@/shared/theme/typography';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import AddRecordForm from '@/features/forms/AddRecordForm/AddRecordForm';
import { RecordType, useRecordsStore } from '@/entities/records/store/recordsStore';

type SelectorOption<T = string> = {
  value: T;
  label: string;
};

type SelectorProps<T = string> = {
  label?: string;
  value: T | T[] | null;
  onChange: (value: T | T[]) => void;
  options: Array<SelectorOption<T>>;
  multiSelect?: boolean;
  disabled?: boolean;
  labelStyle?: TextStyle;
  buttonStyle?: (option: SelectorOption<T>, isSelected: boolean) => ViewStyle;
  buttonTextStyle?: TextStyle;
  name?: RecordType;
};

const Selector = <T extends string | number>({
  label,
  value,
  onChange,
  options,
  multiSelect = false,
  labelStyle,
  disabled = false,
  buttonStyle,
  buttonTextStyle,
  name,
}: SelectorProps<T>) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const inset = useSafeAreaInsets();
  const { getRecordsByType } = useRecordsStore();

  // Подписываемся на изменения в сторе для нашего типа
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    if (!name) {
      return;
    }

    // Получаем текущие записи для сравнения
    let previousRecords = getRecordsByType(name);

    // Подписываемся на изменения в Zustand store
    const unsubscribe = useRecordsStore.subscribe((state) => {
      const currentRecords = state.records.filter((record) => record.type === name);

      // Проверяем, изменились ли записи нашего типа
      if (
        currentRecords.length !== previousRecords.length ||
        currentRecords.some(
          (record, index) => !previousRecords[index] || record.id !== previousRecords[index].id
        )
      ) {
        previousRecords = currentRecords;
        setUpdateTrigger((prev) => prev + 1);
      }
    });

    return unsubscribe;
  }, [name, getRecordsByType]);

  // Объединяем опции с записями из стора
  const combinedOptions = useMemo(() => {
    if (!name) {
      return options;
    }

    // Получаем записи из стора для данного типа
    const storeRecords = getRecordsByType(name);

    // Преобразуем записи в опции
    const storeOptions: SelectorOption<T>[] = storeRecords
      .sort((a, b) => b.timestamp - a.timestamp) // Сортируем по времени (новые сверху)
      .slice(0, 10) // Берем максимум 10 последних записей
      .map((record) => ({
        value: record.text as T,
        label: record.text,
      }));

    // Находим индекс кнопки "+"
    const addButtonIndex = options.findIndex((option) => option.value === '+');

    if (addButtonIndex === -1) {
      // Если нет кнопки "+", просто добавляем записи в конец
      return [...options, ...storeOptions];
    }

    const beforeAddButton = options.slice(0, addButtonIndex);
    const addButton = options[addButtonIndex];
    const afterAddButton = options.slice(addButtonIndex + 1);

    const existingValues = new Set([...beforeAddButton, ...afterAddButton].map((opt) => opt.value));
    const uniqueStoreOptions = storeOptions.filter((opt) => !existingValues.has(opt.value));

    return [...beforeAddButton, ...uniqueStoreOptions, addButton, ...afterAddButton];
  }, [options, name, getRecordsByType, updateTrigger]);

  const handlePress = (optionValue: T) => {
    if (optionValue === '+' && name) {
      BottomSheetManager.show(<AddRecordForm type={name} />, {
        snapPoints: ['90%'],
        topInset: inset.top,
        bottomInset: inset.bottom,
      });
      return;
    }

    if (disabled) {
      return;
    }

    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter((v) => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    } else {
      onChange(optionValue);
    }
  };

  const isSelected = (optionValue: T) => {
    if (multiSelect && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <View>
      {label && (
        <Text color='primary' style={styles.label} variant='body1'>
          {label}
        </Text>
      )}
      <View style={styles.buttonsContainer}>
        {combinedOptions.map((option, index) => (
          <TouchableOpacity
            disabled={disabled}
            key={`${String(option.value)}-${index}`}
            style={[
              styles.button,
              isSelected(option.value) && styles.buttonActive,
              buttonStyle?.(option, isSelected(option.value)),
              disabled && styles.buttonDisabled,
            ]}
            onPress={() => handlePress(option.value)}
          >
            <Text
              style={[
                styles.buttonText,
                buttonTextStyle,
                isSelected(option.value) && styles.buttonTextActive,
                labelStyle,
                disabled && styles.buttonTextDisabled,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    label: {
      marginBottom: 10,
    },
    buttonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    button: {
      paddingHorizontal: 12,
      height: 48,
      borderWidth: 1,
      borderColor: colors.TEXT_SECONDARY,
      borderRadius: 12,
      justifyContent: 'center',
    },
    buttonActive: {
      backgroundColor: colors.PRIMARY,
      borderColor: colors.PRIMARY,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      ...typography.body1,
      color: colors.TEXT_SECONDARY,
    },
    buttonTextActive: {
      color: colors.BACKGROUND_PRIMARY,
    },
    buttonTextDisabled: {
      color: colors.TEXT_PRIMARY,
      opacity: 0.5,
    },
  });

export default Selector;
