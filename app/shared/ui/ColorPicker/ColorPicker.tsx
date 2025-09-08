import React from 'react';
import colorsOptions from 'appData/colors.json';

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
        borderColor: value?.name === option.value ? colors.PRIMARY : 'transparent',
      })}
      label={question.question}
      labelStyle={{ display: 'none' }}
      options={
        colorsOptions?.map((color) => ({
          value: color.name,
          label: color.color,
        })) || []
      }
      value={value?.id || value?.name || null}
      onChange={(selectedValue) => {
        const selectedColor = colorsOptions.find((color) => color.name === selectedValue);
        onChange(selectedColor || null);
      }}
    />
  );
};

export default ColorPicker;
