import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppNavigator from './navigation/AppNavigator';
import { useAuthStore } from './store/authStore';
import { theme } from './theme';

const App: React.FC = () => {
  const { setUser, setToken, setLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const [token, userData] = await Promise.all([
          AsyncStorage.getItem('auth_token'),
          AsyncStorage.getItem('user_data'),
        ]);

        if (token && userData) {
          setToken(token);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={theme.colors.surface}
        />
        <AppNavigator />
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;