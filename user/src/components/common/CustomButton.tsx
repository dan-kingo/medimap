import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  mode?: 'contained' | 'outlined' | 'text';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: any;
  contentStyle?: any;
}

const AnimatedButton = Animated.createAnimatedComponent(Button);

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  mode = 'contained',
  loading = false,
  disabled = false,
  icon,
  style,
  contentStyle,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withTiming(0.8);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1);
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  return (
    <AnimatedButton
      mode={mode}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      loading={loading}
      disabled={disabled || loading}
      icon={icon}
      style={[animatedStyle, styles.button, style]}
      contentStyle={[styles.content, contentStyle]}
      labelStyle={styles.label}
    >
      {title}
    </AnimatedButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    elevation: 2,
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomButton;