import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { ScreenState } from '@/components/ui/ScreenState';
import { useThemeTokens } from '@/hooks/useThemeTokens';
import { formatVnd } from '@/lib/checkout';
import { getListingById } from '@/services/api';
import { selectUser, useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import {
  selectIsFavourite,
  useFavouritesStore,
} from '@/stores/favouritesStore';

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  Textbooks: 'Phụ kiện',
  Electronics: 'Đồ điện tử',
  Stationery: 'Dụng cụ học tập',
  Dorm: 'Đồ ký túc xá',
  Bikes: 'Xe đạp',
  Other: 'Khác',
};

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const listingId = Array.isArray(id) ? id[0] : id;
  const t = useThemeTokens();
  const router = useRouter();
  const user = useAuthStore(selectUser);
  const addItem = useCartStore((s) => s.addItem);
  const lastMessage = useCartStore((s) => s.lastMessage);
  const isFavourite = useFavouritesStore(selectIsFavourite(listingId ?? ''));
  const toggle = useFavouritesStore((s) => s.toggle);

  const query = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => getListingById(listingId!),
    enabled: Boolean(listingId),
  });

  const listing = query.data ?? null;
  const showSellerChrome = user?.role === 'seller';
  const showBuyerChrome = !showSellerChrome;

  const status = query.isLoading
    ? 'loading'
    : query.isError
      ? 'error'
      : !listing
        ? 'empty'
        : 'content';

  return (
    <ScreenState
      status={status}
      errorMessage={
        query.error instanceof Error
          ? query.error.message
          : 'Không thể tải thông tin sản phẩm.'
      }
      emptyTitle="Không tìm thấy sản phẩm"
      emptyMessage="Sản phẩm có thể đã bị xóa hoặc không khả dụng khi ngoại tuyến."
      onRetry={() => {
        void query.refetch();
      }}
    >
      {listing ? (
        <ScrollView
          style={{ backgroundColor: t.background }}
          contentContainerStyle={styles.content}
        >
          <Image
            source={{ uri: listing.photoUri }}
            style={styles.image}
            accessibilityLabel={`Hình ảnh của ${listing.title}`}
          />
          <Text style={[styles.category, { color: t.textSecondary }]}>
            {CATEGORY_TRANSLATIONS[listing.category] ?? listing.category}
          </Text>
          <Text style={[styles.title, { color: t.text }]}>{listing.title}</Text>
          <Text style={[styles.price, { color: t.tint }]}>
            {formatVnd(listing.price)}
          </Text>
          <Text style={{ color: t.textSecondary }}>
            Người bán: {listing.sellerName} ·{' '}
            {listing.stock > 0
              ? `Còn ${listing.stock} sản phẩm`
              : 'Đã hết hàng'}
          </Text>
          <Text style={[styles.desc, { color: t.text }]}>{listing.description}</Text>

          {showSellerChrome ? (
            <View
              style={[
                styles.panel,
                { backgroundColor: t.tintMuted, borderColor: t.tint },
              ]}
            >
              <Text style={[styles.panelTitle, { color: t.tint }]}>
                Giao diện người bán
              </Text>
              <Text style={{ color: t.text }}>
                Bạn đang đăng nhập với vai trò người bán. Giao diện này chú trọng
                vào tồn kho và trạng thái bài đăng; người mua sẽ thấy các nút mua hàng.
              </Text>
              <Text style={{ color: t.textSecondary, marginTop: 6 }}>
                Tồn kho: {listing.stock} · Ngày đăng:{' '}
                {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
              </Text>
            </View>
          ) : null}

          {showBuyerChrome ? (
            <View style={styles.actions}>
              <AppButton
                label={isFavourite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                variant="secondary"
                onPress={() => toggle(listing.id, listing.price)}
              />
              <AppButton
                label="Thêm vào giỏ hàng"
                disabled={listing.stock <= 0}
                onPress={() => {
                  const ok = addItem(listing);
                  if (ok) {
                    // stay on page; message via cart store
                  }
                }}
              />
              <AppButton
                label="Đến giỏ hàng"
                variant="ghost"
                onPress={() => router.push('/(tabs)/cart')}
              />
            </View>
          ) : (
            <View style={styles.actions}>
              <AppButton
                label={isFavourite ? 'Bỏ yêu thích' : 'Lưu vào yêu thích'}
                variant="secondary"
                onPress={() => toggle(listing.id, listing.price)}
              />
              <AppButton
                label="Thử thêm vào giỏ (Người mua)"
                onPress={() => addItem(listing)}
              />
            </View>
          )}

          {lastMessage ? (
            <Text
              style={{ color: t.warning, marginTop: 8 }}
              accessibilityRole="alert"
            >
              {lastMessage}
            </Text>
          ) : null}
        </ScrollView>
      ) : null}
    </ScreenState>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40, gap: 8 },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: { fontSize: 24, fontWeight: '800' },
  price: { fontSize: 22, fontWeight: '700' },
  desc: { fontSize: 15, lineHeight: 22, marginTop: 8 },
  panel: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  panelTitle: { fontWeight: '800', fontSize: 15 },
  actions: { gap: 10, marginTop: 16 },
});