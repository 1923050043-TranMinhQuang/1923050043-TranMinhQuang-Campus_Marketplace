import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { catalogueQueryKey } from '@/lib/queryClient';
import {
  fetchCatalogue,
  readCatalogueCache,
  type CatalogueResult,
} from '@/services/api';
import { notifyFavouritePriceChange } from '@/services/notifications';
import { useFavouritesStore } from '@/stores/favouritesStore';

async function loadCatalogue(isOffline: boolean): Promise<CatalogueResult> {
  if (isOffline) {
    const cache = await readCatalogueCache();
    if (cache) {
      return {
        listings: cache.listings,
        fetchedAt: cache.savedAt,
        fromCache: true,
      };
    }
    throw new Error('You are offline and no catalogue cache is available yet.');
  }

  try {
    return await fetchCatalogue();
  } catch (error) {
    const cache = await readCatalogueCache();
    if (cache) {
      return {
        listings: cache.listings,
        fetchedAt: cache.savedAt,
        fromCache: true,
      };
    }
    throw error instanceof Error
      ? error
      : new Error('Failed to load catalogue.');
  }
}

export function useCatalogue() {
  const { isOffline } = useNetworkStatus();
  const favouriteIds = useFavouritesStore((s) => s.ids);
  const notifiedRef = useRef<Set<string>>(new Set());

  const query = useQuery({
    queryKey: [...catalogueQueryKey, isOffline ? 'offline' : 'online'],
    queryFn: () => loadCatalogue(isOffline),
  });

  useEffect(() => {
    const listings = query.data?.listings;
    if (!listings || query.data?.fromCache || favouriteIds.length === 0) return;

    // Lấy snapshot hiện tại trực tiếp từ store để không bị trigger re-render
    const currentSnapshots = useFavouritesStore.getState().priceSnapshot;
    const updates: Record<string, number> = {};
    let hasChanges = false;

    for (const id of favouriteIds) {
      const listing = listings.find((l) => l.id === id);
      if (!listing) continue;

      const previous = currentSnapshots[id];
      if (previous !== undefined && previous !== listing.price) {
        const key = `${id}:${previous}:${listing.price}`;
        if (!notifiedRef.current.has(key)) {
          notifiedRef.current.add(key);
          void notifyFavouritePriceChange({
            title: listing.title,
            oldPrice: previous,
            newPrice: listing.price,
          });
        }
        updates[id] = listing.price;
        hasChanges = true;
      } else if (previous === undefined) {
        // Khởi tạo snapshot lần đầu nếu chưa có
        updates[id] = listing.price;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      useFavouritesStore.getState().syncSnapshots(updates);
    }
  }, [query.data, favouriteIds]);

  return {
    ...query,
    isOffline,
    showingCached: Boolean(query.data?.fromCache) || isOffline,
    lastUpdated: query.data?.fetchedAt ?? null,
    listings: query.data?.listings ?? [],
  };
}