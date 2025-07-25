import Icon from 'react-native-vector-icons/Ionicons';
import { View, Alert, TouchableOpacity, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';

import { createStyles } from './AddRecordForm.styles';

import Title from '@/shared/ui/Title/Title';
import Input from '@/shared/ui/Input/Input';
import BottomSheetManager from '@/shared/ui/BottomSheet/BottomSheetManager';
import { Button } from '@/shared/ui';
import { useTheme } from '@/shared/theme';
import { useRecordsStore, RecordType } from '@/entities/records/store/recordsStore';

interface AddRecordFormProps {
  type: RecordType;
}

const getFormConfig = (type: RecordType) => {
  switch (type) {
    case 'emotions':
      return {
        title: 'Добавить эмоцию',
        placeholder: 'Введите вашу эмоцию...',
        sectionTitle: 'Ранее добавленные эмоции',
        emptyText: 'Пока нет сохраненных эмоций',
      };
    case 'activities':
      return {
        title: 'Добавить занятие',
        placeholder: 'Введите занятие...',
        sectionTitle: 'Ранее добавленные занятия',
      };
    case 'mood':
      return {
        title: 'Добавить настроение',
        placeholder: 'Введите ваше настроение...',
        sectionTitle: 'Ранее добавленные настроения',
      };
    default:
      return {
        title: 'Добавить запись',
        placeholder: 'Введите текст...',
        sectionTitle: 'Ранее добавленные записи',
        emptyText: 'Пока нет записей',
      };
  }
};

const AddRecordForm = ({ type }: AddRecordFormProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { addRecord, getRecordsByType, removeRecord } = useRecordsStore();

  const [value, setValue] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const config = getFormConfig(type);
  const existingRecords = getRecordsByType(type);

  const uniqueRecords = existingRecords.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20); // Показываем максимум 20 последних записей

  const handleSubmit = async () => {
    const textToSave = selectedTag || value.trim();

    if (!textToSave) {
      BottomSheetManager.hide();
      return;
    }

    setIsLoading(true);

    try {
      addRecord(type, textToSave);
      BottomSheetManager.hide();
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить запись');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setValue('');
    setSelectedTag(null);
    BottomSheetManager.hide();
  };

  const handleTagPress = (record: any) => {
    if (selectedTag === record.text) {
      setSelectedTag(null);
      setValue('');
    } else {
      setSelectedTag(record.text);
      setValue(record.text);
    }
  };

  const handleDeleteRecord = (recordId: string, recordText: string) => {
    Alert.alert('Удалить запись', `Вы уверены, что хотите удалить "${recordText}"?`, [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: () => {
          removeRecord(recordId);
          // Если удаляемая запись была выбрана, сбрасываем выбор
          if (selectedTag === recordText) {
            setSelectedTag(null);
            setValue('');
          }
        },
      },
    ]);
  };

  const handleInputChange = (text: string) => {
    setValue(text);
    setSelectedTag(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Title fontSize={18} fontWeight='600' textAlign='center'>
            {config.title}
          </Title>
        </View>

        <Input
          autoFocus
          placeholder={config.placeholder}
          style={styles.input}
          value={value}
          onChangeText={handleInputChange}
        />

        {uniqueRecords.length > 0 && (
          <View style={styles.existingTagsSection}>
            <Text style={styles.sectionTitle}>{config.sectionTitle}</Text>
            <View style={styles.tagsContainer}>
              {uniqueRecords.map((record) => (
                <TouchableOpacity
                  key={record.id}
                  style={[styles.tag, selectedTag === record.text && styles.selectedTag]}
                  onPress={() => handleTagPress(record)}
                >
                  <Text
                    style={[styles.tagText, selectedTag === record.text && styles.selectedTagText]}
                  >
                    {record.text}
                  </Text>
                  <TouchableOpacity
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                    style={styles.deleteButton}
                    onPress={() => handleDeleteRecord(record.id, record.text)}
                  >
                    <Icon
                      color={
                        selectedTag === record.text
                          ? colors.BACKGROUND_PRIMARY
                          : colors.TEXT_SECONDARY
                      }
                      name='close'
                      size={12}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          disabled={isLoading}
          style={styles.button}
          title='Отмена'
          variant='outline'
          onPress={handleCancel}
        />
        <Button
          disabled={isLoading}
          style={styles.button}
          title='Сохранить'
          variant='primary'
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

export default AddRecordForm;
