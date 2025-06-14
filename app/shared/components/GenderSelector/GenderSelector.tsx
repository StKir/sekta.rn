import React from 'react';

import Selector from '@/shared/components/Selector';

type Gender = 'male' | 'female' | 'other';

type GenderSelectorProps = {
  label?: string;
  value: Gender | null;
  onChange: (value: Gender) => void;
  options?: Array<{
    value: Gender;
    label: string;
  }>;
};

const defaultOptions = [
  { value: 'male' as Gender, label: 'Мужчина' },
  { value: 'female' as Gender, label: 'Женщина' },
  { value: 'other' as Gender, label: '...' },
];

const GenderSelector = ({
  label,
  value,
  onChange,
  options = defaultOptions,
}: GenderSelectorProps) => {
  return <Selector label={label} options={options} value={value} onChange={onChange} />;
};

export default GenderSelector;
