import { router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CategoryChips } from '@/components/CategoryChips';
import { ListingCard } from '@/components/ListingCard';
import { OfflineBanner } from '@/components/OfflineBanner';
import { SearchBar } from '@/components/SearchBar';
import { ScreenState } from '@/components/ui/ScreenState';
import { useCatalogue } from '@/hooks/useCatalogue';
import { useThemeTokens } from '@/hooks/useThemeTokens';
import { filterListings } from '@/lib/filterListings';
import { selectUser, useAuthStore } from '@/stores/authStore';
import type { ListingCategory } from '@/types/models';

export default function BrowseScreen() {
  const t = useThemeTokens();
  const user = useAuthStore(selectUser);
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

  // Filter inputs only — filtered results are computed during render, not stored.
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ListingCategory | 'All'>('All');

  const filtered = filterListings(listings, query, category);

  const status =
    isLoading && listings.length === 0
      ? 'loading'
      : isError && listings.length === 0
        ? 'error'
        : filtered.length === 0
          ? 'empty'
          : 'content';

  return (
    <View style={[styles.flex, { backgroundColor: t.background }]}>
      <OfflineBanner
        visible={showingCached || isOffline}
        lastUpdated={lastUpdated}
      />
      <View style={styles.toolbar}>
        <SearchBar value={query} onChangeText={setQuery} />
        <CategoryChips value={category} onChange={setCategory} />
        <View style={styles.metaRow}>
          <Text style={{ color: t.textSecondary, fontSize: 13 }}>
            {lastUpdated
              ? `Cập nhật lúc: ${new Date(lastUpdated).toLocaleTimeString('vi-VN')}`
              : 'Chưa cập nhật'}
          </Text>
          {user?.role === 'seller' ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Đăng tin mới"
              onPress={() => router.push('/listing/create')}
              style={[styles.createBtn, { backgroundColor: t.tint }]}
            >
              <Text style={{ color: t.onTint, fontWeight: '700' }}>+ Đăng tin</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScreenState
        status={status}
        errorMessage={error instanceof Error ? error.message : undefined}
        emptyTitle="Không có sản phẩm phù hợp"
        emptyMessage="Hãy thử tìm theo danh mục hoặc từ khóa khác."
        onRetry={() => {
          void refetch();
        }}
      >
        <FlatList
          data={filtered}
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
  toolbar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  createBtn: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
});