import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AuthStackParamList } from '@/navigation/AuthNavigator';
import CustomTextInput from '@/components/common/CustomTextInput';
import CustomButton from '@/components/common/CustomButton';
import Header from '@/components/common/Header';
import { authAPI } from '@/services/api';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPasswordRequestOtp(phone);
      Alert.alert(
        'Success',
        'OTP sent to your phone number',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SetPassword'),
          },
        ]
      );
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
      <Header title="Forgot Password" showBack />
      
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text variant="headlineSmall" style={styles.title}>
            Reset Password
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Enter your phone number to receive a password reset code
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

          <CustomButton
            title="Send Reset Code"
            onPress={handleSendOtp}
            loading={loading}
            style={styles.sendButton}
          />
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
  sendButton: {
    marginTop: 24,
    width: '100%',
  },
});

export default ForgotPasswordScreen;