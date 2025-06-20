import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  FadeIn 
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoadingScreen: React.FC = () => {
  const theme = useTheme();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.content}>
        <Animated.View style={[animatedStyle, styles.iconContainer]}>
          <Icon 
            name="medical-bag" 
            size={60} 
            color={theme.colors.primary} 
          />
        </Animated.View>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
          MediMap
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Your health, our priority
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
});

export default LoadingScreen;