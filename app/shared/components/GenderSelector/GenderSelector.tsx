import React from 'react';

import Selector from '@/shared/ui/Selector';

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
  const handleChange = (gender: Gender | Gender[]) => {
    const selectedValue = Array.isArray(gender) ? gender[0] : gender;
    onChange(selectedValue);
  };

  return <Selector label={label} options={options} value={value} onChange={handleChange} />;
};

export default GenderSelector;
