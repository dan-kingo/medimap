import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { theme } from '@/src/constants/theme';
import { authAPI } from '@/src/services/api';
import Header from '@/src/components/Header';

export default function SetPasswordScreen() {
  const params = useLocalSearchParams();
  const { phone } = params;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetPassword = async () => {
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.setPassword(password);
      
      Toast.show({
        type: 'success',
        text1: 'Password Set Successfully',
        text2: 'You can now login with your new password',
      });
      
      router.replace({
        pathname: '/login',
        params: { phone: phone as string }
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Set Password" showBack />
      
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text variant="headlineSmall" style={styles.title}>
            Create Your Password
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Secure your account with a password
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.form}>
          <TextInput
            label="New Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError('');
            }}
            placeholder="Enter at least 6 characters"
            secureTextEntry
            mode="outlined"
            error={!!error}
            style={styles.input}
          />
          
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (error) setError('');
            }}
            placeholder="Re-enter your password"
            secureTextEntry
            mode="outlined"
            error={!!error}
            style={[styles.input, { marginTop: 16 }]}
          />
          
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>

          <Button
            mode="contained"
            onPress={handleSetPassword}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Set Password
          </Button>
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
  input: {
    width: '100%',
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    width: '100%',
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});