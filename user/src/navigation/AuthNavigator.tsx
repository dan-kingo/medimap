import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '@/screens/auth/WelcomeScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import OtpVerificationScreen from '@/screens/auth/OtpVerificationScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import SetPasswordScreen from '@/screens/auth/SetPasswordScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  OtpVerification: {
    phone: string;
    isRegistration?: boolean;
    userData?: {
      name?: string;
      email?: string;
      location?: string;
    };
  };
  ForgotPassword: undefined;
  SetPassword: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;