import { router } from 'expo-router';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { ScreenState } from '@/components/ui/ScreenState';
import { useCatalogue } from '@/hooks/useCatalogue';
import { useThemeTokens } from '@/hooks/useThemeTokens';
import { buildCheckoutSummary, formatVnd } from '@/lib/checkout';
import {
  selectCartItems,
  useCartStore,
} from '@/stores/cartStore';

export default function CartScreen() {
  const t = useThemeTokens();
  const items = useCartStore(selectCartItems);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const lastMessage = useCartStore((s) => s.lastMessage);
  const clearMessage = useCartStore((s) => s.clearMessage);
  const { listings, isLoading, isError, error, refetch } = useCatalogue();

  const summary = buildCheckoutSummary(items, listings);

  const status =
    isLoading && listings.length === 0
      ? 'loading'
      : isError && listings.length === 0
        ? 'error'
        : items.length === 0
          ? 'empty'
          : 'content';

  return (
    <View style={[styles.flex, { backgroundColor: t.background }]}>
      {lastMessage ? (
        <Pressable
          onPress={clearMessage}
          accessibilityRole="button"
          accessibilityLabel={`Thông báo giỏ hàng: ${lastMessage}. Nhấn để đóng.`}
          style={[styles.message, { backgroundColor: t.warningMuted }]}
        >
          <Text style={{ color: t.warning }}>{lastMessage}</Text>
        </Pressable>
      ) : null}

      <ScreenState
        status={status}
        errorMessage={error instanceof Error ? error.message : undefined}
        emptyTitle="Giỏ hàng đang trống"
        emptyMessage="Hãy khám phá các danh mục và thêm sản phẩm vào giỏ hàng của bạn."
        onRetry={() => {
          void refetch();
        }}
      >
        <FlatList
          data={summary.lines}
          keyExtractor={(line) => line.listingId}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            summary.errors.length > 0 ? (
              <View
                style={[styles.errors, { backgroundColor: t.dangerMuted }]}
                accessibilityRole="alert"
              >
                {summary.errors.map((msg) => (
                  <Text key={msg} style={{ color: t.danger, marginBottom: 4 }}>
                    {msg}
                  </Text>
                ))}
              </View>
            ) : (
              <View />
            )
          }
          renderItem={({ item: line }) => {
            const listing = listings.find((l) => l.id === line.listingId);
            return (
              <View
                style={[
                  styles.row,
                  { backgroundColor: t.surface, borderColor: t.border },
                ]}
              >
                <View style={styles.rowMeta}>
                  <Text style={[styles.title, { color: t.text }]}>{line.title}</Text>
                  <Text style={{ color: t.textSecondary }}>
                    {formatVnd(line.unitPrice)} · tồn kho: {line.stock}
                  </Text>
                  <Text style={{ color: t.tint, fontWeight: '700' }}>
                    {formatVnd(line.lineTotal)}
                  </Text>
                </View>
                <View style={styles.qty}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Giảm số lượng của ${line.title}`}
                    onPress={() =>
                      setQuantity(line.listingId, line.quantity - 1, listing)
                    }
                    style={[styles.qtyBtn, { borderColor: t.border }]}
                  >
                    <Text style={{ color: t.text, fontSize: 18 }}>−</Text>
                  </Pressable>
                  <Text
                    style={{ color: t.text, minWidth: 28, textAlign: 'center' }}
                    accessibilityLabel={`Số lượng ${line.quantity}`}
                  >
                    {line.quantity}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Tăng số lượng của ${line.title}`}
                    onPress={() =>
                      setQuantity(line.listingId, line.quantity + 1, listing)
                    }
                    style={[styles.qtyBtn, { borderColor: t.border }]}
                  >
                    <Text style={{ color: t.text, fontSize: 18 }}>+</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Xóa ${line.title}`}
                    onPress={() => removeItem(line.listingId)}
                    style={styles.remove}
                  >
                    <Text style={{ color: t.danger }}>Xóa</Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            <View style={styles.footer}>
              <Text style={{ color: t.textSecondary }}>{summary.deliveryRule}</Text>
              <Text style={[styles.total, { color: t.text }]}>
                Tạm tính: {formatVnd(summary.subtotal)}
              </Text>
              <Text style={[styles.total, { color: t.text }]}>
                Phí giao hàng: {formatVnd(summary.deliveryFee)}
              </Text>
              <Text style={[styles.grand, { color: t.tint }]}>
                Tổng cộng: {formatVnd(summary.total)}
              </Text>
              <AppButton
                label="Xem tóm tắt đặt hàng"
                onPress={() => router.push('/checkout')}
              />
            </View>
          }
        />
      </ScreenState>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  message: {
    padding: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  list: { padding: 16, gap: 12 },
  errors: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  row: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  rowMeta: { gap: 4 },
  title: { fontSize: 16, fontWeight: '600' },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  qtyBtn: {
    minWidth: 44,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remove: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  footer: { gap: 8, marginTop: 8, paddingBottom: 24 },
  total: { fontSize: 15 },
  grand: { fontSize: 20, fontWeight: '800', marginVertical: 4 },
});