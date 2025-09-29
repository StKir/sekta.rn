import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import React, { useEffect } from 'react';

import { AlertOptions, AlertButton } from './types';
import { createStyles } from './CustomAlert.styles';

import { useTheme } from '@/shared/theme';

type CustomAlertProps = {
  visible: boolean;
  options: AlertOptions;
  onClose: () => void;
};

const CustomAlert = ({ visible, options, onClose }: CustomAlertProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 100,
      });
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.8, { duration: 150 });
      translateY.value = withTiming(30, { duration: 150 });
    }
  }, [opacity, scale, translateY, visible]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handleClose = () => {
    onClose();
    options.onClose?.();
  };

  const handleButtonPress = (button: AlertButton) => {
    button.onPress?.();
    handleClose();
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.alertContainer];

    switch (options.type) {
      case 'success':
        return [...baseStyle, styles.successContainer];
      case 'error':
        return [...baseStyle, styles.errorContainer];
      case 'warning':
        return [...baseStyle, styles.warningContainer];
      case 'info':
        return [...baseStyle, styles.infoContainer];
      default:
        return baseStyle;
    }
  };

  const getIconStyle = () => {
    switch (options.type) {
      case 'success':
        return [styles.iconContainer, styles.successIcon];
      case 'error':
        return [styles.iconContainer, styles.errorIcon];
      case 'warning':
        return [styles.iconContainer, styles.warningIcon];
      case 'info':
        return [styles.iconContainer, styles.infoIcon];
      default:
        return null;
    }
  };

  const getIconText = () => {
    switch (options.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '!';
      case 'info':
        return 'i';
      default:
        return null;
    }
  };

  const renderButtons = () => {
    const buttons =
      options.buttons && options.buttons.length > 0
        ? options.buttons
        : [{ text: 'OK', style: 'default' as const }];

    return (
      <View style={styles.buttonsContainer}>
        {buttons.map((button, index) => {
          const getButtonStyle = () => {
            switch (button.style) {
              case 'cancel':
                return [styles.button, styles.cancelButton];
              case 'destructive':
                return [styles.button, styles.destructiveButton];
              default:
                return [styles.button, styles.defaultButton];
            }
          };

          const getTextStyle = () => {
            switch (button.style) {
              case 'cancel':
                return [styles.buttonText, styles.cancelButtonText];
              case 'destructive':
                return [styles.buttonText, styles.destructiveButtonText];
              default:
                return [styles.buttonText, styles.defaultButtonText];
            }
          };

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              key={index}
              style={getButtonStyle()}
              onPress={() => handleButtonPress(button)}
            >
              <Text style={getTextStyle()}>{button.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <Modal statusBarTranslucent transparent animationType='none' visible={visible}>
      <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
        <Pressable style={styles.flex1} onPress={handleClose} />
        <Animated.View style={[getContainerStyle(), animatedContainerStyle]}>
          <View style={styles.titleContainer}>
            {getIconStyle() && (
              <View style={getIconStyle()}>
                <Text style={styles.iconText}>{getIconText()}</Text>
              </View>
            )}
            <Text style={styles.title}>{options.title}</Text>
          </View>

          {options.message && <Text style={styles.message}>{options.message}</Text>}

          {renderButtons()}
        </Animated.View>
        <Pressable style={styles.flex1} onPress={handleClose} />
      </Animated.View>
    </Modal>
  );
};

export default CustomAlert;
