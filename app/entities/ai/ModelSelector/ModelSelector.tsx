import { View, StyleSheet } from 'react-native';
import React from 'react';

import { AIModel } from '@/types/aiTypes';
import Text from '@/shared/ui/Text';
import Selector from '@/shared/ui/Selector/Selector';
import BottomSheetManager from '@/shared/ui/BottomSheet/BottomSheetManager';
import { ThemeColors } from '@/shared/theme/types';
import { useTheme } from '@/shared/theme';
import { SPACING } from '@/shared/constants';
import { useUserStore } from '@/entities/user/store/userStore';

type ModelSelectorProps = {
  onClose?: () => void;
};

const ModelSelector = ({ onClose }: ModelSelectorProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { selectedAIModel, setSelectedAIModel } = useUserStore();

  const handleModelChange = (model: AIModel | AIModel[]) => {
    const modelAi = typeof model === 'string' ? model : model[0];
    setSelectedAIModel(modelAi);
    if (onClose) {
      onClose();
    } else {
      BottomSheetManager.hide();
    }
  };

  const modelOptions = Object.values(AIModel).map((model) => {
    return {
      value: model,
      label: getModelDisplayName(model),
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant='h3'>
        Выберите модель AI
      </Text>
      <Selector options={modelOptions} value={selectedAIModel} onChange={handleModelChange} />
    </View>
  );
};

export const getModelDisplayName = (model: AIModel) => {
  return model.replaceAll('-', ' ');
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: SPACING.LARGE,
    },
    title: {
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.LARGE,
      textAlign: 'center',
    },
  });

export default ModelSelector;
