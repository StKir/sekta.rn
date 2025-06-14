import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import React from 'react';

import { useTheme } from '../../theme';

import { createEmojiButtonStyles } from './EmojiButton.styles';

type EmojiButtonProps = {
  emoji: string;
  label: string;
  isSelected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  emojiStyle?: TextStyle;
  labelStyle?: TextStyle;
};

const EmojiButton = ({
  emoji,
  label,
  isSelected = false,
  onPress,
  style,
  emojiStyle,
  labelStyle,
}: EmojiButtonProps) => {
  const { colors } = useTheme();
  const styles = createEmojiButtonStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected, style]}
      onPress={onPress}
    >
      <Text style={[styles.emoji, emojiStyle]}>{emoji}</Text>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default EmojiButton;
