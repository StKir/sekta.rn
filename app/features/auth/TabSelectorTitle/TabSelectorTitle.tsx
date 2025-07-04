import { FlatList, TouchableOpacity } from 'react-native';
import React from 'react';

import Title from '@/shared/ui/Title';
import { useTheme } from '@/shared/theme';
import { SIZES, SPACING } from '@/shared/constants';

type TabSelectorProps = {
  tabs: string[];
  activeTab: number;
  onTabPress: (tab: number) => void;
};

const TabSelectorTitle = ({ tabs, activeTab, onTabPress }: TabSelectorProps) => {
  const { colors } = useTheme();
  return (
    <FlatList
      horizontal
      data={tabs}
      ItemSeparatorComponent={() => (
        <Title color={colors.TEXT_TERTIARY} fontWeight={SIZES.FONT_WEIGHT.REGULAR}>
          {' / '}
        </Title>
      )}
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => (
        <TouchableOpacity onPress={() => onTabPress(index)}>
          <Title
            color={index === activeTab ? colors.TEXT_PRIMARY : colors.TEXT_TERTIARY}
            marginBottom={SPACING.LARGE}
          >
            {item}
          </Title>
        </TouchableOpacity>
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default TabSelectorTitle;
