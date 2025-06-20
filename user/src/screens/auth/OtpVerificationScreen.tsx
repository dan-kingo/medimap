import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AuthStackParamList } from '@/navigation/AuthNavigator';
import CustomTextInput from '@/components/common/CustomTextInput';
import CustomButton from '@/components/common/CustomButton';
import Header from '@/components/common/Header';
import { authAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

type OtpVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OtpVerification'>;
type OtpVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'OtpVerification'>;

interface OtpVerificationScreenProps {
  navigation: OtpVerificationScreenNavigationProp;
  route: OtpVerificationScreenRouteProp;
}

const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const theme = useTheme();
  const { login } = useAuthStore();
  const { phone, isRegistration, userData } = route.params;
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

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
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOtp(phone, otp);
      const { token, user } = response.data;
      login(token, user);
    } catch (error: any) {
      Alert.alert(
        'Verification Failed',
        error.response?.data?.message || 'Invalid OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      if (isRegistration && userData) {
        await authAPI.requestOtp({
          phone,
          name: userData.name,
          email: userData.email,
          location: userData.location,
        });
      } else {
        await authAPI.resendOtp(phone);
      }
      setCountdown(60);
      Alert.alert('Success', 'OTP sent successfully');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to resend OTP'
      );
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
          <CustomTextInput
            label="OTP Code"
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter 6-digit code"
            keyboardType="numeric"
            style={styles.otpInput}
          />

          <CustomButton
            title="Verify"
            onPress={handleVerifyOtp}
            loading={loading}
            style={styles.verifyButton}
          />

          <View style={styles.resendContainer}>
            {countdown > 0 ? (
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Resend code in {countdown}s
              </Text>
            ) : (
              <CustomButton
                title="Resend OTP"
                onPress={handleResendOtp}
                loading={resendLoading}
                mode="text"
              />
            )}
          </View>
        </Animated.View>
      </View>
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
  },
  verifyButton: {
    marginTop: 24,
    width: '100%',
  },
  resendContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
});

export default OtpVerificationScreen;