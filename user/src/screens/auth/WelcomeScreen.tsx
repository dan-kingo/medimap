import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthStackParamList } from '@/navigation/AuthNavigator';
import CustomButton from '@/components/common/CustomButton';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View 
        entering={FadeInUp.delay(200).duration(800)}
        style={styles.header}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
          <Icon 
            name="medical-bag" 
            size={80} 
            color={theme.colors.primary} 
          />
        </View>
        <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>
          MediMap
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Find medicines from nearby pharmacies
        </Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(400).duration(800)}
        style={styles.features}
      >
        <View style={styles.feature}>
          <Icon name="map-search" size={32} color={theme.colors.primary} />
          <Text variant="bodyMedium" style={styles.featureText}>
            Search nearby pharmacies
          </Text>
        </View>
        <View style={styles.feature}>
          <Icon name="pill" size={32} color={theme.colors.primary} />
          <Text variant="bodyMedium" style={styles.featureText}>
            Find medicines easily
          </Text>
        </View>
        <View style={styles.feature}>
          <Icon name="truck-delivery" size={32} color={theme.colors.primary} />
          <Text variant="bodyMedium" style={styles.featureText}>
            Home delivery available
          </Text>
        </View>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(600).duration(800)}
        style={styles.buttons}
      >
        <CustomButton
          title="Get Started"
          onPress={() => navigation.navigate('Register')}
          style={styles.primaryButton}
        />
        <CustomButton
          title="I already have an account"
          onPress={() => navigation.navigate('Login')}
          mode="outlined"
          style={styles.secondaryButton}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  features: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  buttons: {
    paddingBottom: 32,
  },
  primaryButton: {
    marginBottom: 16,
  },
  secondaryButton: {
    marginBottom: 8,
  },
});

export default WelcomeScreen;