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
import { useAuthStore } from '@/store/authStore';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { login } = useAuthStore();
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [useOtp, setUseOtp] = useState(false);

  const handlePasswordLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.loginWithPassword(phone, password);
      const { token, user } = response.data;
      login(token, user);
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Invalid credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      await authAPI.requestOtp({ phone });
      navigation.navigate('OtpVerification', { phone });
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to send OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Sign In" showBack />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text variant="headlineSmall" style={styles.title}>
            Welcome back!
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Sign in to your account to continue
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.form}>
          <CustomTextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          {!useOtp && (
            <CustomTextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          )}

          <CustomButton
            title={useOtp ? "Send OTP" : "Sign In"}
            onPress={useOtp ? handleOtpLogin : handlePasswordLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <CustomButton
            title={useOtp ? "Use Password Instead" : "Use OTP Instead"}
            onPress={() => setUseOtp(!useOtp)}
            mode="text"
            style={styles.switchButton}
          />

          <CustomButton
            title="Forgot Password?"
            onPress={() => navigation.navigate('ForgotPassword')}
            mode="text"
            style={styles.forgotButton}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.footer}>
          <Text variant="bodyMedium" style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            Don't have an account?{' '}
            <Text 
              style={{ color: theme.colors.primary, fontWeight: '600' }}
              onPress={() => navigation.navigate('Register')}
            >
              Sign Up
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
  loginButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  switchButton: {
    marginBottom: 8,
  },
  forgotButton: {
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    textAlign: 'center',
  },
});

export default LoginScreen;