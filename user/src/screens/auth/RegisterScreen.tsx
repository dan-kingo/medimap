import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AuthStackParamList } from '@/navigation/AuthNavigator';
import CustomTextInput from '@/components/common/CustomTextInput';
import CustomButton from '@/components/common/CustomButton';
import Header from '@/components/common/Header';
import { authAPI } from '@/services/api';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.name || !formData.phone) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      await authAPI.requestOtp({
        phone: formData.phone,
        name: formData.name,
        email: formData.email,
        location: formData.location,
      });
      
      navigation.navigate('OtpVerification', {
        phone: formData.phone,
        isRegistration: true,
        userData: {
          name: formData.name,
          email: formData.email,
          location: formData.location,
        },
      });
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'Failed to send OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Sign Up" showBack />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text variant="headlineSmall" style={styles.title}>
            Create Account
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Join MediMap to find medicines easily
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.form}>
          <CustomTextInput
            label="Full Name *"
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            placeholder="Enter your full name"
          />

          <CustomTextInput
            label="Phone Number *"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <CustomTextInput
            label="Email (Optional)"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomTextInput
            label="Location (Optional)"
            value={formData.location}
            onChangeText={(value) => updateFormData('location', value)}
            placeholder="Enter your city/town"
          />

          <CustomButton
            title="Continue"
            onPress={handleRegister}
            loading={loading}
            style={styles.continueButton}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.footer}>
          <Text variant="bodyMedium" style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            Already have an account?{' '}
            <Text 
              style={{ color: theme.colors.primary, fontWeight: '600' }}
              onPress={() => navigation.navigate('Login')}
            >
              Sign In
            </Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  form: {
    marginBottom: 32,
  },
  continueButton: {
    marginTop: 24,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    textAlign: 'center',
  },
});

export default RegisterScreen;