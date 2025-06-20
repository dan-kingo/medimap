import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, Chip, useTheme, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';

import { MainStackParamList } from '@/navigation/MainNavigator';
import Header from '@/components/common/Header';
import CustomTextInput from '@/components/common/CustomTextInput';
import CustomButton from '@/components/common/CustomButton';
import { medicineAPI, homeAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Medicine, Pharmacy } from '@/types';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuthStore();
  const { getTotalItems } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [popularMedicines, setPopularMedicines] = useState<Medicine[]>([]);
  const [nearbyPharmacies, setNearbyPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    getCurrentLocation();
    fetchPopularMedicines();
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyPharmacies();
    }
  }, [location]);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log('Location error:', error);
        Alert.alert(
          'Location Access',
          'Unable to get your location. Please enable location services for better experience.'
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchPopularMedicines = async () => {
    try {
      const response = await medicineAPI.getPopularMedicines();
      setPopularMedicines(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching popular medicines:', error);
    }
  };

  const fetchNearbyPharmacies = async () => {
    if (!location) return;
    
    try {
      const response = await homeAPI.getNearbyPharmacies(location.latitude, location.longitude);
      setNearbyPharmacies(response.data.pharmacies.slice(0, 5));
    } catch (error) {
      console.error('Error fetching nearby pharmacies:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('SearchResults', { query: searchQuery.trim() });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchPopularMedicines(),
      location ? fetchNearbyPharmacies() : Promise.resolve(),
    ]);
    setRefreshing(false);
  };

  const cartItemCount = getTotalItems();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title={`Hello, ${user?.name || 'User'}!`}
        subtitle="Find medicines from nearby pharmacies"
        actions={[
          <Icon 
            key="notifications"
            name="bell-outline" 
            size={24} 
            color={theme.colors.onSurface}
            onPress={() => navigation.navigate('Notifications')}
          />
        ]}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Search Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.searchSection}>
          <CustomTextInput
            label=""
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for medicines..."
            left={<Icon name="magnify" size={24} color={theme.colors.onSurfaceVariant} />}
            right={
              searchQuery ? (
                <Icon 
                  name="close" 
                  size={24} 
                  color={theme.colors.onSurfaceVariant}
                  onPress={() => setSearchQuery('')}
                />
              ) : undefined
            }
            onSubmitEditing={handleSearch}
          />
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.quickActions}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionButtons}>
            <CustomButton
              title="Search Medicine"
              onPress={() => navigation.navigate('SearchTab')}
              icon="magnify"
              mode="outlined"
              style={styles.actionButton}
            />
            <CustomButton
              title="Upload Prescription"
              onPress={() => navigation.navigate('Cart')}
              icon="camera"
              mode="outlined"
              style={styles.actionButton}
            />
          </View>
        </Animated.View>

        {/* Popular Medicines */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Popular Medicines
            </Text>
            <Text 
              variant="bodyMedium" 
              style={[styles.seeAll, { color: theme.colors.primary }]}
              onPress={() => navigation.navigate('SearchTab')}
            >
              See All
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularMedicines.map((medicine, index) => (
              <Card key={medicine._id} style={styles.medicineCard}>
                <Card.Content>
                  <Text variant="titleSmall" numberOfLines={2}>
                    {medicine.name}
                  </Text>
                  <Text variant="bodySmall" style={styles.medicineType}>
                    {medicine.type} • {medicine.strength}
                  </Text>
                  <Text variant="titleMedium" style={styles.medicinePrice}>
                    ${medicine.price}
                  </Text>
                  {medicine.requiresPrescription && (
                    <Chip mode="outlined" compact style={styles.prescriptionChip}>
                      Prescription Required
                    </Chip>
                  )}
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Nearby Pharmacies */}
        <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Nearby Pharmacies
            </Text>
            <Text 
              variant="bodyMedium" 
              style={[styles.seeAll, { color: theme.colors.primary }]}
              onPress={getCurrentLocation}
            >
              Refresh
            </Text>
          </View>
          {nearbyPharmacies.map((pharmacy) => (
            <Card key={pharmacy._id} style={styles.pharmacyCard}>
              <Card.Content>
                <View style={styles.pharmacyHeader}>
                  <Text variant="titleSmall">{pharmacy.name}</Text>
                  {pharmacy.distance && (
                    <Text variant="bodySmall" style={styles.distance}>
                      {pharmacy.distance.toFixed(1)} km
                    </Text>
                  )}
                </View>
                <Text variant="bodySmall" style={styles.pharmacyLocation}>
                  {pharmacy.city}
                </Text>
                <View style={styles.pharmacyFeatures}>
                  {pharmacy.deliveryAvailable && (
                    <Chip mode="outlined" compact>
                      Delivery Available
                    </Chip>
                  )}
                  {pharmacy.rating && (
                    <View style={styles.rating}>
                      <Icon name="star" size={16} color={theme.colors.primary} />
                      <Text variant="bodySmall">{pharmacy.rating}</Text>
                    </View>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button for Cart */}
      {cartItemCount > 0 && (
        <FAB
          icon="cart"
          label={cartItemCount.toString()}
          onPress={() => navigation.navigate('Cart')}
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchSection: {
    marginVertical: 16,
  },
  quickActions: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  seeAll: {
    fontWeight: '500',
  },
  medicineCard: {
    width: 160,
    marginRight: 12,
    marginBottom: 8,
  },
  medicineType: {
    marginTop: 4,
    opacity: 0.7,
  },
  medicinePrice: {
    marginTop: 8,
    fontWeight: '600',
  },
  prescriptionChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  pharmacyCard: {
    marginBottom: 12,
  },
  pharmacyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distance: {
    opacity: 0.7,
  },
  pharmacyLocation: {
    marginTop: 4,
    opacity: 0.7,
  },
  pharmacyFeatures: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;