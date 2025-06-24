import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Divider, RadioButton, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { theme } from '@/src/constants/theme';
import Header from '@/src/components/Header';
import { useCartStore } from '@/src/store/cartStore';
import { createOrder } from '@/src/services/orderService';
import { useAuthStore } from '@/src/store/authStore';

type OrderStatus = 'Placed' | 'Accepted' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export default function OrderConfirmationScreen() {
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD'>('COD');
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);

  const requiresPrescription = items.some(item => item.medicine.requiresPrescription);

  const pickPrescriptionImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'We need access to your photos to upload prescriptions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPrescriptionImage(result.assets[0].uri);
    }
  };

  const handlePlaceOrder = async () => {
    if (deliveryType === 'delivery' && !address.trim()) {
      Alert.alert('Error', 'Please enter your delivery address');
      return;
    }

    if (requiresPrescription && !prescriptionImage) {
      Alert.alert('Prescription Required', 'Please upload a prescription for your order');
      return;
    }

    setLoading(true);

    try {
      let location = null;
      if (deliveryType === 'delivery') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is needed for delivery');
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({});
        location = {
          type: 'Point',
          coordinates: [currentLocation.coords.longitude, currentLocation.coords.latitude]
        };
      }

      const orderItems = items.map(item => ({
        medicineId: item.medicine._id,
        pharmacyId: item.pharmacy._id,
        quantity: item.quantity,
        price: item.medicine.price,
      }));

      const status: OrderStatus = 'Placed';

      const formData = new FormData();
      
      // Add order data
      formData.append('user', user?._id || '');
      formData.append('items', JSON.stringify(orderItems));
      formData.append('totalAmount', getTotalPrice().toString());
      formData.append('deliveryType', deliveryType);
      if (deliveryType === 'delivery') {
        formData.append('address', address);
        formData.append('location', JSON.stringify(location));
      }
      formData.append('status', status);
      formData.append('paymentMethod', paymentMethod);
      if (notes.trim()) {
        formData.append('notes', notes);
      }
      
      // Add prescription image if needed
      if (requiresPrescription && prescriptionImage) {
        const localUri = prescriptionImage;
        const filename = localUri.split('/').pop() || 'prescription.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('prescription', {
          uri: localUri,
          name: filename,
          type,
        } as any);
      }

      // Create order in the database
      await createOrder(formData);
      
      // Clear cart after successful order creation
      clearCart();
      
      // Redirect to orders screen
      router.replace('/orders');
    } catch (error) {
      console.error('Order creation failed:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Order Confirmation"
        showBack
      />

      <ScrollView style={styles.content}>
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Delivery Options
            </Text>
            
            <RadioButton.Group 
              onValueChange={value => setDeliveryType(value as 'delivery' | 'pickup')} 
              value={deliveryType}
            >
              <View style={styles.radioOption}>
                <RadioButton value="delivery" />
                <View style={styles.radioTextContainer}>
                  <Text variant="bodyMedium">Home Delivery</Text>
                  <Text variant="bodySmall" style={styles.optionDescription}>
                    Get your order delivered to your location
                  </Text>
                </View>
              </View>
              
              <View style={styles.radioOption}>
                <RadioButton value="pickup" />
                <View style={styles.radioTextContainer}>
                  <Text variant="bodyMedium">Pickup from Pharmacy</Text>
                  <Text variant="bodySmall" style={styles.optionDescription}>
                    Collect your order at the pharmacy
                  </Text>
                </View>
              </View>
            </RadioButton.Group>

            {deliveryType === 'delivery' && (
              <TextInput
                mode="outlined"
                label="Delivery Address"
                placeholder="Enter your full address including landmarks"
                value={address}
                onChangeText={setAddress}
                style={styles.addressInput}
                multiline
                numberOfLines={3}
              />
            )}

            {deliveryType === 'pickup' && (
              <View style={styles.pickupInfo}>
                <MaterialCommunityIcons 
                  name="store-marker-outline" 
                  size={20} 
                  color={theme.colors.primary} 
                />
                <Text variant="bodySmall" style={styles.pickupText}>
                  You'll receive pickup instructions after order confirmation
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {requiresPrescription && (
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Prescription Upload
              </Text>
              <Text variant="bodySmall" style={styles.prescriptionNote}>
                Prescription required for some items in your order
              </Text>
              <Button 
                mode="outlined" 
                onPress={pickPrescriptionImage}
                icon="file-upload"
                style={styles.uploadButton}
              >
                {prescriptionImage ? 'Change Prescription' : 'Upload Prescription'}
              </Button>
              {prescriptionImage && (
                <Text variant="bodySmall" style={styles.uploadSuccessText}>
                  Prescription uploaded successfully
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Payment Method
            </Text>
            <RadioButton.Group 
              onValueChange={value => setPaymentMethod(value as 'COD')} 
              value={paymentMethod}
            >
              <View style={styles.radioOption}>
                <RadioButton value="COD" />
                <View style={styles.radioTextContainer}>
                  <Text variant="bodyMedium">Cash on Delivery</Text>
                  <Text variant="bodySmall" style={styles.optionDescription}>
                    Pay when you receive your order
                  </Text>
                </View>
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Order Summary
            </Text>
            
            {items.map((item, index) => (
              <View key={`${item.medicine._id}-${item.pharmacy._id}`} style={styles.orderItem}>
                <View style={styles.orderItemDetails}>
                  <Text variant="bodyMedium">{item.medicine.name}</Text>
                  <Text variant="bodySmall" style={styles.orderItemPharmacy}>
                    {item.pharmacy.name} • {item.quantity} × ${item.medicine.price.toFixed(2)}
                  </Text>
                  {item.medicine.requiresPrescription && (
                    <Text variant="bodySmall" style={styles.prescriptionNote}>
                      Prescription required
                    </Text>
                  )}
                </View>
                <Text variant="bodyMedium" style={styles.itemTotal}>
                  ${(item.quantity * item.medicine.price).toFixed(2)}
                </Text>
                {index < items.length - 1 && <Divider style={styles.itemDivider} />}
              </View>
            ))}

            <Divider style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">Subtotal</Text>
              <Text variant="bodyMedium">${getTotalPrice().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">Delivery Fee</Text>
              <Text variant="bodyMedium">$0.00</Text>
            </View>
            <View style={[styles.summaryRow, { marginTop: 8 }]}>
              <Text variant="titleLarge">Total</Text>
              <Text variant="titleLarge">${getTotalPrice().toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Additional Information
            </Text>
            <TextInput
              mode="outlined"
              label="Notes (optional)"
              placeholder="Any special instructions for your order?"
              value={notes}
              onChangeText={setNotes}
              style={styles.notesInput}
              multiline
              numberOfLines={3}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          mode="contained" 
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={loading}
          style={styles.placeOrderButton}
          contentStyle={styles.placeOrderButtonContent}
        >
          {loading ? 'Placing Order...' : 'Confirm Order'}
        </Button>
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  radioTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  optionDescription: {
    opacity: 0.7,
    marginTop: 2,
  },
  addressInput: {
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  pickupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  pickupText: {
    marginLeft: 8,
    opacity: 0.7,
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemPharmacy: {
    opacity: 0.7,
    marginTop: 2,
  },
  prescriptionNote: {
    color: theme.colors.error,
    marginTop: 4,
    fontSize: 12,
  },
  itemTotal: {
    fontWeight: '500',
  },
  itemDivider: {
    marginVertical: 8,
  },
  summaryDivider: {
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notesInput: {
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    backgroundColor: theme.colors.background,
  },
  placeOrderButton: {
    borderRadius: 8,
  },
  placeOrderButtonContent: {
    height: 50,
  },
  uploadButton: {
    marginTop: 12,
  },
  uploadSuccessText: {
    color: theme.colors.primary,
    marginTop: 8,
    textAlign: 'center',
  },
});