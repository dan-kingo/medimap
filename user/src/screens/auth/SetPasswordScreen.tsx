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

type SetPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SetPassword'>;

interface SetPasswordScreenProps {
  navigation: SetPasswordScreenNavigationProp;
}

const SetPasswordScreen: React.FC<SetPasswordScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!formData.phone || !formData.otp || !formData.newPassword || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifyForgotPasswordOtp(formData.phone, formData.otp);
      Alert.alert(
        'Success',
        'Password reset successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to reset password'
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
      <Header title="Set New Password" showBack />
      
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text variant="headlineSmall" style={styles.title}>
            Create New Password
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Enter the OTP and create a new password
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.form}>
          <CustomTextInput
            label="Phone Number"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <CustomTextInput
            label="OTP Code"
            value={formData.otp}
            onChangeText={(value) => updateFormData('otp', value)}
            placeholder="Enter 6-digit code"
            keyboardType="numeric"
          />

          <CustomTextInput
            label="New Password"
            value={formData.newPassword}
            onChangeText={(value) => updateFormData('newPassword', value)}
            placeholder="Enter new password"
            secureTextEntry
          />

          <CustomTextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            placeholder="Confirm new password"
            secureTextEntry
          />

          <CustomButton
            title="Reset Password"
            onPress={handleResetPassword}
            loading={loading}
            style={styles.resetButton}
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
  resetButton: {
    marginTop: 24,
    width: '100%',
  },
});

export default SetPasswordScreen;