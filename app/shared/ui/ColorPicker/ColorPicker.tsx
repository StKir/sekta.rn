import React from 'react';

import Selector from '../Selector';

import { FormQuestion } from '@/shared/types/form.types';
import { useTheme } from '@/shared/theme';

type ColorPickerProps = {
  question: FormQuestion;
  value: any;
  onChange: (value: any) => void;
};

const ColorPicker = ({ question, value, onChange }: ColorPickerProps) => {
  const { colors } = useTheme();
  return (
    <Selector
      buttonStyle={(option) => ({
        backgroundColor: option.label,
        width: 64,
        borderRadius: 14,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: value?.id === option.value ? colors.PRIMARY : 'transparent',
      })}
      label={question.question}
      labelStyle={{ display: 'none' }}
      options={
        question.colors?.map((color) => ({
          value: color.id || color.name,
          label: color.color,
        })) || []
      }
      value={value?.id || value?.name || null}
      onChange={(selectedValue) => {
        const selectedColor = question.colors?.find(
          (color) => (color.id || color.name) === selectedValue
        );
        onChange(selectedColor || null);
      }}
    />
  );
};

export default ColorPicker;
