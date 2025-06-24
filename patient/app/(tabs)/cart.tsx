import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, IconButton, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { theme } from '@/src/constants/theme';
import Header from '@/src/components/Header';
import { useCartStore } from '@/src/store/cartStore';

export default function CartScreen() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (medicineId: string, pharmacyId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', onPress: () => removeFromCart(medicineId, pharmacyId) },
        ]
      );
    } else {
      updateQuantity(medicineId, pharmacyId, newQuantity);
    }
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: clearCart },
      ]
    );
  };

  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Shopping Cart" actions={[
                  <MaterialCommunityIcons 
                    key="notifications"
                    name="bell-outline" 
                    size={24} 
                    color={theme.colors.onSurface}
                    onPress={() => router.push('/notifications')}
                  />
                ]}/>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons 
            name="cart-outline" 
            size={64} 
            color={theme.colors.onSurfaceVariant} 
          />
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            Your cart is empty
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtitle}>
            Add some medicines to get started
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push('/search')}
            style={styles.shopButton}
          >
            Start Shopping
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Shopping Cart"
        actions={[
          <IconButton
            key="clear"
            icon="delete-outline"
            onPress={handleClearCart}
          />
        ]}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {items.map((item, index) => (
          <Animated.View key={`${item.medicine._id}-${item.pharmacy._id}`} entering={FadeInDown.delay(index * 100).duration(300)}>
            <Card style={styles.cartItem}>
              <Card.Content>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Text variant="titleMedium" numberOfLines={2}>
                      {item.medicine.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.itemDetails}>
                      {item.medicine.type} • {item.medicine.strength}
                    </Text>
                    <View style={styles.pharmacyInfo}>
                      <MaterialCommunityIcons name="store" size={14} color={theme.colors.primary} />
                      <Text variant="bodySmall" style={styles.pharmacyName}>
                        {item.pharmacy.name}
                      </Text>
                    </View>
                  </View>
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => removeFromCart(item.medicine._id, item.pharmacy._id)}
                  />
                </View>

                <View style={styles.itemFooter}>
                  <View style={styles.quantityControls}>
                    <IconButton
                      icon="minus"
                      size={20}
                      onPress={() => handleQuantityChange(item.medicine._id, item.pharmacy._id, item.quantity - 1)}
                    />
                    <Text variant="titleMedium" style={styles.quantity}>
                      {item.quantity}
                    </Text>
                    <IconButton
                      icon="plus"
                      size={20}
                      onPress={() => handleQuantityChange(item.medicine._id, item.pharmacy._id, item.quantity + 1)}
                    />
                  </View>
                  <Text variant="titleMedium" style={styles.itemPrice}>
                    ${(item.medicine.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Cart Summary */}
      <Animated.View entering={FadeInDown.delay(500).duration(300)} style={styles.summary}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryRow}>
              <Text variant="titleMedium">Total Items:</Text>
              <Text variant="titleMedium">{items.reduce((sum, item) => sum + item.quantity, 0)}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text variant="titleLarge" style={styles.totalLabel}>Total:</Text>
              <Text variant="titleLarge" style={styles.totalPrice}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={handleProceedToCheckout}
              loading={loading}
              disabled={loading}
              style={styles.checkoutButton}
              contentStyle={styles.checkoutButtonContent}
            >
              Proceed to Checkout
            </Button>
          </Card.Content>
        </Card>
      </Animated.View>
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
    paddingTop: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  shopButton: {
    borderRadius: 12,
  },
  cartItem: {
    marginBottom: 12,
    borderRadius: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemInfo: {
    flex: 1,
  },
  itemDetails: {
    marginTop: 4,
    opacity: 0.7,
  },
  pharmacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pharmacyName: {
    marginLeft: 4,
    opacity: 0.7,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  itemPrice: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  summary: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  summaryCard: {
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  divider: {
    marginVertical: 12,
  },
  totalLabel: {
    fontWeight: '600',
  },
  totalPrice: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  checkoutButton: {
    marginTop: 16,
    borderRadius: 12,
  },
  checkoutButtonContent: {
    paddingVertical: 8,
  },
});