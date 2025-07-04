import { View, ViewStyle } from 'react-native';
import React from 'react';

import { SPACING } from '@/shared/constants';

type MainContainerProps = {} & React.PropsWithChildren & ViewStyle;

const MainContainer = ({ children, ...props }: MainContainerProps) => {
  return <View style={{ marginHorizontal: SPACING.LARGE, ...props }}>{children}</View>;
};

export default MainContainer;
