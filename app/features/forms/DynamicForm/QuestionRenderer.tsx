import { View, StyleSheet } from 'react-native';
import React from 'react';

import TextArea from '@/shared/ui/TextArea';
import Text from '@/shared/ui/Text';
import Selector from '@/shared/ui/Selector';
import Range from '@/shared/ui/Range';
import MediaPicker from '@/shared/ui/MediaPicker';
import Input from '@/shared/ui/Input';
import ColorPicker from '@/shared/ui/ColorPicker/ColorPicker';
import { Button } from '@/shared/ui';
import { FormQuestion } from '@/shared/types/form.types';
import { RecordType } from '@/entities/records/store/recordsStore';

type QuestionRendererProps = {
  question: FormQuestion;
  value: any;
  onChange: (value: any) => void;
  onNext?: () => void;
};

const QuestionRenderer = ({ question, value, onChange, onNext }: QuestionRendererProps) => {
  const validateInput = (inputValue: string) => {
    if (!question.validation) {
      return true;
    }

    const { required, minLength, maxLength, min, max } = question.validation;

    if (required && (!inputValue || inputValue.trim() === '')) {
      return false;
    }
    if (minLength && inputValue.length < minLength) {
      return false;
    }
    if (maxLength && inputValue.length > maxLength) {
      return false;
    }

    const numValue = Number(inputValue);
    if (!isNaN(numValue)) {
      if (min !== undefined && numValue < min) {
        return false;
      }
      if (max !== undefined && numValue > max) {
        return false;
      }
    }

    return true;
  };

  const renderByType = () => {
    switch (question.type) {
      case 'title':
        return null;

      case 'welcome':
        return (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText} variant='h2'>
              {question.question}
            </Text>
            {onNext && <Button fullWidth title='Начать' onPress={onNext} />}
          </View>
        );

      case 'text': {
        const isValid = validateInput(value || '');
        return (
          <Input
            error={value && !isValid ? 'Некорректное значение' : undefined}
            keyboardType={question.name === 'age' ? 'numeric' : 'default'}
            label={question.question}
            placeholder={question.name === 'age' ? 'Возраст' : '| '}
            value={value || ''}
            onChangeText={onChange}
          />
        );
      }

      case 'area': {
        return (
          <TextArea
            label={question.question}
            placeholder='Введите текст'
            value={value || ''}
            onChangeText={onChange}
          />
        );
      }

      case 'media':
        return <MediaPicker value={value} onChange={onChange} />;

      case 'quote':
        return (
          <Input
            label={question.question}
            placeholder='Введите ответ'
            value={value || ''}
            onChangeText={onChange}
          />
        );

      case 'range':
        return (
          <Range
            color={question.color}
            label={question.question}
            max={100}
            min={0}
            showValue={true}
            value={value || 0}
            onChange={onChange}
          />
        );

      case 'gender':
        return (
          <Selector
            label={question.question}
            options={
              question.options?.map((opt) => ({
                value: opt.name,
                label: opt.name,
              })) || []
            }
            value={value}
            onChange={onChange}
          />
        );

      case 'avatar':
        return (
          <Selector
            buttonStyle={() => ({
              width: 64,
              height: 64,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 0,
            })}
            buttonTextStyle={styles.avatarText}
            label={question.question}
            options={
              question.options?.map((opt) => ({
                value: opt.name,
                label: opt.name,
              })) || []
            }
            value={value}
            onChange={onChange}
          />
        );

      case 'multi_select':
        return (
          <Selector
            multiSelect
            label={question.question}
            name={question.name as RecordType}
            options={
              question.options?.map((opt) => ({
                value: opt.name,
                label: opt.name,
              })) || []
            }
            value={value}
            onChange={onChange}
          />
        );

      case 'select':
        return (
          <Selector
            label={question.question}
            name={question.name as RecordType}
            options={
              question.options?.map((opt) => ({
                value: opt.name,
                label: opt.name,
              })) || []
            }
            value={value}
            onChange={onChange}
          />
        );

      case 'tags': {
        return (
          <Selector
            label={question.question}
            name={question.name as RecordType}
            options={
              question.tags?.map((tag) => ({
                value: tag.name,
                label: tag.name,
              })) || []
            }
            value={value}
            onChange={onChange}
          />
        );
      }
      case 'color':
        return <ColorPicker question={question} value={value} onChange={onChange} />;

      default:
        return null;
    }
  };

  return renderByType();
};

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 32,
  },
  avatarButton: {
    width: 64,
    height: 64,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  avatarText: {
    fontSize: 32,
    lineHeight: 40,
  },
});

export default QuestionRenderer;
