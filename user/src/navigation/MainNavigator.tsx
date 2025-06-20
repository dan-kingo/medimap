import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '@/screens/main/HomeScreen';
import SearchScreen from '@/screens/main/SearchScreen';
import OrdersScreen from '@/screens/main/OrdersScreen';
import ProfileScreen from '@/screens/main/ProfileScreen';
import NotificationsScreen from '@/screens/main/NotificationsScreen';

import MedicineDetailsScreen from '@/screens/medicine/MedicineDetailsScreen';
import SearchResultsScreen from '@/screens/medicine/SearchResultsScreen';
import CartScreen from '@/screens/cart/CartScreen';
import CheckoutScreen from '@/screens/cart/CheckoutScreen';
import OrderDetailsScreen from '@/screens/orders/OrderDetailsScreen';
import OrderTrackingScreen from '@/screens/orders/OrderTrackingScreen';
import EditProfileScreen from '@/screens/profile/EditProfileScreen';
import AddressManagementScreen from '@/screens/profile/AddressManagementScreen';
import ChangePasswordScreen from '@/screens/profile/ChangePasswordScreen';

export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  MedicineDetails: { medicineId: string };
  SearchResults: { query: string; filters?: any };
  Cart: undefined;
  Checkout: undefined;
  OrderDetails: { orderId: string };
  OrderTracking: { orderId: string };
  Notifications: undefined;
  EditProfile: undefined;
  AddressManagement: undefined;
  ChangePassword: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

const TabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'SearchTab':
              iconName = focused ? 'magnify' : 'magnify';
              break;
            case 'OrdersTab':
              iconName = focused ? 'package-variant' : 'package-variant-closed';
              break;
            case 'ProfileTab':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="SearchTab" 
        component={SearchScreen}
        options={{ tabBarLabel: 'Search' }}
      />
      <Tab.Screen 
        name="OrdersTab" 
        component={OrdersScreen}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="MedicineDetails" component={MedicineDetailsScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="AddressManagement" component={AddressManagementScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;