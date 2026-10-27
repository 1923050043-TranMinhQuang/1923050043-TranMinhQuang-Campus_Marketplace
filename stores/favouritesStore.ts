import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type FavouritesState = {
  ids: string[];
  /** Last known prices for favourited listings — used to detect changes. */
  priceSnapshot: Record<string, number>;
  toggle: (listingId: string, currentPrice?: number) => void;
  isFavourite: (listingId: string) => boolean;
  setPriceSnapshot: (listingId: string, price: number) => void;
  syncSnapshots: (prices: Record<string, number>) => void;
};

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      priceSnapshot: {},

      toggle: (listingId, currentPrice) => {
        const { ids, priceSnapshot } = get();
        if (ids.includes(listingId)) {
          const nextSnap = { ...priceSnapshot };
          delete nextSnap[listingId];
          set({
            ids: ids.filter((id) => id !== listingId),
            priceSnapshot: nextSnap,
          });
          return;
        }
        set({
          ids: [...ids, listingId],
          priceSnapshot:
            currentPrice === undefined
              ? priceSnapshot
              : { ...priceSnapshot, [listingId]: currentPrice },
        });
      },

      isFavourite: (listingId) => get().ids.includes(listingId),

      setPriceSnapshot: (listingId, price) =>
        set((s) => ({
          priceSnapshot: { ...s.priceSnapshot, [listingId]: price },
        })),

      syncSnapshots: (prices) =>
        set((s) => ({
          priceSnapshot: { ...s.priceSnapshot, ...prices },
        })),
    }),
    {
      name: 'campus.favourites',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        ids: state.ids,
        priceSnapshot: state.priceSnapshot,
      }),
    },
  ),
);

export const selectFavouriteIds = (s: FavouritesState) => s.ids;
export const selectIsFavourite =
  (listingId: string) => (s: FavouritesState) =>
    s.ids.includes(listingId);
