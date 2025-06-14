import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';
import React from 'react';

type RadialGradientBackgroundProps = {
  children?: React.ReactNode;
};

const RadialGradientBackground = ({ children }: RadialGradientBackgroundProps) => {
  return (
    <LinearGradient
      colors={['#FF8C00', '#FF4500', '#DC143C', '#000000']}
      end={{ x: 0.9, y: 0.45 }}
      start={{ x: 0.8, y: 1 }}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RadialGradientBackground;
