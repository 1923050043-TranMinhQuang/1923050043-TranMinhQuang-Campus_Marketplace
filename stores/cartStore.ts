import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { canAddToCart } from '@/lib/checkout';
import type { CartItem, Listing } from '@/types/models';

type CartState = {
  items: CartItem[];
  lastMessage: string | null;
  addItem: (listing: Listing, quantity?: number) => boolean;
  setQuantity: (listingId: string, quantity: number, listing?: Listing) => boolean;
  removeItem: (listingId: string) => void;
  clear: () => void;
  clearMessage: () => void;
  quantityFor: (listingId: string) => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastMessage: null,

      quantityFor: (listingId) =>
        get().items.find((i) => i.listingId === listingId)?.quantity ?? 0,

      addItem: (listing, quantity = 1) => {
        const current = get().quantityFor(listing.id);
        const check = canAddToCart(listing, current, quantity);
        if (!check.ok) {
          set({ lastMessage: check.message });
          return false;
        }
        const existing = get().items.find((i) => i.listingId === listing.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.listingId === listing.id
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
            lastMessage: `Đã thêm vào giỏ hàng (${current + quantity}).`,
          });
        } else {
          set({
            items: [...get().items, { listingId: listing.id, quantity }],
            lastMessage: 'Đã thêm vào giỏ hàng.',
          });
        }
        return true;
      },

      setQuantity: (listingId, quantity, listing) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter((i) => i.listingId !== listingId),
            lastMessage: null,
          });
          return true;
        }
        if (listing) {
          const check = canAddToCart(listing, 0, quantity);
          if (!check.ok) {
            set({ lastMessage: check.message });
            return false;
          }
        }
        const exists = get().items.some((i) => i.listingId === listingId);
        if (exists) {
          set({
            items: get().items.map((i) =>
              i.listingId === listingId ? { ...i, quantity } : i,
            ),
            lastMessage: null,
          });
        } else if (listing) {
          set({
            items: [...get().items, { listingId, quantity }],
            lastMessage: null,
          });
        }
        return true;
      },

      removeItem: (listingId) =>
        set({
          items: get().items.filter((i) => i.listingId !== listingId),
        }),

      clear: () => set({ items: [], lastMessage: null }),
      clearMessage: () => set({ lastMessage: null }),
    }),
    {
      name: 'campus.cart',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const selectCartItems = (s: CartState) => s.items;
export const selectCartCount = (s: CartState) =>
  s.items.reduce((n, i) => n + i.quantity, 0);