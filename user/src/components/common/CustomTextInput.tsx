import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';

interface CustomTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: any;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  left,
  right,
  style,
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderWidth = useSharedValue(1);
  const borderColor = useSharedValue(theme.colors.outline);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderWidth: borderWidth.value,
      borderColor: borderColor.value,
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    borderWidth.value = withTiming(2);
    borderColor.value = withTiming(theme.colors.primary);
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderWidth.value = withTiming(1);
    borderColor.value = withTiming(error ? theme.colors.error : theme.colors.outline);
  };

  return (
    <AnimatedTextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      error={!!error}
      disabled={disabled}
      multiline={multiline}
      numberOfLines={numberOfLines}
      mode="outlined"
      onFocus={handleFocus}
      onBlur={handleBlur}
      left={left}
      right={right}
      style={[animatedStyle, styles.input, style]}
      outlineStyle={styles.outline}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    backgroundColor: 'transparent',
  },
  outline: {
    borderRadius: 12,
  },
});

export default CustomTextInput;