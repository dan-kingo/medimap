import { create } from 'zustand';
import { CartItem, Medicine, Pharmacy } from '@/types';

interface CartState {
  items: CartItem[];
  
  // Actions
  addToCart: (medicine: Medicine, pharmacy: Pharmacy, quantity?: number) => void;
  removeFromCart: (medicineId: string, pharmacyId: string) => void;
  updateQuantity: (medicineId: string, pharmacyId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (medicine, pharmacy, quantity = 1) => {
    const { items } = get();
    const existingItemIndex = items.findIndex(
      item => item.medicine._id === medicine._id && item.pharmacy._id === pharmacy._id
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      set({ items: updatedItems });
    } else {
      // Add new item
      const newItem: CartItem = {
        medicine,
        pharmacy,
        quantity,
      };
      set({ items: [...items, newItem] });
    }
  },

  removeFromCart: (medicineId, pharmacyId) => {
    const { items } = get();
    const filteredItems = items.filter(
      item => !(item.medicine._id === medicineId && item.pharmacy._id === pharmacyId)
    );
    set({ items: filteredItems });
  },

  updateQuantity: (medicineId, pharmacyId, quantity) => {
    const { items } = get();
    if (quantity <= 0) {
      get().removeFromCart(medicineId, pharmacyId);
      return;
    }

    const updatedItems = items.map(item => {
      if (item.medicine._id === medicineId && item.pharmacy._id === pharmacyId) {
        return { ...item, quantity };
      }
      return item;
    });
    set({ items: updatedItems });
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + (item.medicine.price * item.quantity), 0);
  },
}));