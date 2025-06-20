import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { theme } from '@/src/constants/theme';
import { authAPI } from '@/src/services/api';
import { useAuthStore } from '@/src/store/authStore';
import Header from '@/src/components/common/Header';

export default function OtpVerificationScreen() {
  const { login } = useAuthStore();
  const params = useLocalSearchParams();
  const { phone, isRegistration, isLogin, userData } = params;
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOtp(phone as string, otp);
      const { token, user } = response.data;
      login(token, user);
      Toast.show({
        type: 'success',
        text1: 'Verification Successful',
        text2: 'Welcome to MediMap!',
      });
      router.replace('/(tabs)');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      if (isRegistration === 'true' && userData) {
        const parsedUserData = JSON.parse(userData as string);
        await authAPI.requestOtp({
          phone: phone as string,
          name: parsedUserData.name,
          email: parsedUserData.email,
          location: parsedUserData.location,
        });
      } else {
        await authAPI.resendOtp(phone as string);
      }
      setCountdown(60);
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'A new OTP has been sent to your phone',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to resend OTP',
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Verify OTP" showBack />
      
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text variant="headlineSmall" style={styles.title}>
            Enter Verification Code
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            We've sent a 6-digit code to {phone}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.form}>
          <TextInput
            label="OTP Code"
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              if (error) setError('');
            }}
            placeholder="Enter 6-digit code"
            keyboardType="numeric"
            mode="outlined"
            error={!!error}
            style={styles.otpInput}
            maxLength={6}
          />
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>

          <Button
            mode="contained"
            onPress={handleVerifyOtp}
            loading={loading}
            disabled={loading}
            style={styles.verifyButton}
            contentStyle={styles.buttonContent}
          >
            Verify
          </Button>

          <View style={styles.resendContainer}>
            {countdown > 0 ? (
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Resend code in {countdown}s
              </Text>
            ) : (
              <Button
                mode="text"
                onPress={handleResendOtp}
                loading={resendLoading}
                disabled={resendLoading}
              >
                Resend OTP
              </Button>
            )}
          </View>
        </Animated.View>
      </View>
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
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    alignItems: 'center',
  },
  otpInput: {
    width: '100%',
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
    marginBottom: 8,
  },
  verifyButton: {
    marginTop: 24,
    width: '100%',
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  resendContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
});