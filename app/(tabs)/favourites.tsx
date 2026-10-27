import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { ListingCard } from '@/components/ListingCard';
import { OfflineBanner } from '@/components/OfflineBanner';
import { ScreenState } from '@/components/ui/ScreenState';
import { useCatalogue } from '@/hooks/useCatalogue';
import { useThemeTokens } from '@/hooks/useThemeTokens';
import { selectFavouriteIds, useFavouritesStore } from '@/stores/favouritesStore';

export default function FavouritesScreen() {
  const t = useThemeTokens();
  const favouriteIds = useFavouritesStore(selectFavouriteIds);
  const {
    listings,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    showingCached,
    lastUpdated,
    isOffline,
  } = useCatalogue();

  const favourites = listings.filter((l) => favouriteIds.includes(l.id));

  const status =
    isLoading && listings.length === 0
      ? 'loading'
      : isError && listings.length === 0
        ? 'error'
        : favouriteIds.length === 0 || favourites.length === 0
          ? 'empty'
          : 'content';

  return (
    <View style={[styles.flex, { backgroundColor: t.background }]}>
      <OfflineBanner
        visible={showingCached || isOffline}
        lastUpdated={lastUpdated}
      />
      <Text style={[styles.hint, { color: t.textSecondary }]}>
        Mục yêu thích được đồng bộ giữa trang Khám phá và tab này, tự động lưu lại kể cả khi khởi động lại ứng dụng.
      </Text>
      <ScreenState
        status={status}
        errorMessage={error instanceof Error ? error.message : undefined}
        emptyTitle="Chưa có mục yêu thích nào"
        emptyMessage="Nhấn biểu tượng trái tim trên sản phẩm ở trang Khám phá để lưu vào đây."
        onRetry={() => {
          void refetch();
        }}
      >
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ListingCard listing={item} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                void refetch();
              }}
              tintColor={t.tint}
            />
          }
        />
      </ScreenState>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hint: {
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 13,
    lineHeight: 18,
  },
  list: { padding: 16 },
});