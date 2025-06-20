import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { theme } from '@/src/constants/theme';
import { authAPI } from '@/src/services/api';
import Header from '@/src/components/common/Header';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await authAPI.requestOtp({
        phone: formData.phone,
        name: formData.name,
        email: formData.email,
        location: formData.location,
      });
      
      router.push({
        pathname: '/(auth)/otp-verification',
        params: {
          phone: formData.phone,
          isRegistration: 'true',
          userData: JSON.stringify({
            name: formData.name,
            email: formData.email,
            location: formData.location,
          }),
        },
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.response?.data?.message || 'Failed to send OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
          <TextInput
            label="Full Name *"
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            placeholder="Enter your full name"
            mode="outlined"
            error={!!errors.name}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.name}>
            {errors.name}
          </HelperText>

          <TextInput
            label="Phone Number *"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            mode="outlined"
            error={!!errors.phone}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.phone}>
            {errors.phone}
          </HelperText>

          <TextInput
            label="Email (Optional)"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Location (Optional)"
            value={formData.location}
            onChangeText={(value) => updateFormData('location', value)}
            placeholder="Enter your city/town"
            mode="outlined"
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.continueButton}
            contentStyle={styles.buttonContent}
          >
            Continue
          </Button>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.footer}>
          <Text variant="bodyMedium" style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            Already have an account?{' '}
            <Text 
              style={{ color: theme.colors.primary, fontWeight: '600' }}
              onPress={() => router.push('/(auth)/login')}
            >
              Sign In
            </Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

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
  input: {
    marginBottom: 8,
  },
  continueButton: {
    marginTop: 24,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    textAlign: 'center',
  },
});