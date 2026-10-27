import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { ScreenState } from '@/components/ui/ScreenState';
import { useCatalogue } from '@/hooks/useCatalogue';
import { useThemeTokens } from '@/hooks/useThemeTokens';
import { buildCheckoutSummary, formatVnd } from '@/lib/checkout';
import { queryClient } from '@/lib/queryClient';
import { deductStock } from '@/services/api';
import { selectCartItems, useCartStore } from '@/stores/cartStore';

export default function CheckoutModal() {
  const t = useThemeTokens();
  const items = useCartStore(selectCartItems);
  const clear = useCartStore((s) => s.clear);
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
    <ScreenState
      status={status}
      errorMessage={error instanceof Error ? error.message : undefined}
      emptyTitle="Không có sản phẩm để thanh toán"
      emptyMessage="Vui lòng thêm sản phẩm vào giỏ hàng trước."
      onRetry={() => {
        void refetch();
      }}
    >
      <ScrollView
        style={{ backgroundColor: t.background }}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.heading, { color: t.text }]}>Tóm tắt đặt hàng</Text>
        <Text style={{ color: t.textSecondary, marginBottom: 12 }}>
          Tạm tính, phí giao hàng trong trường và tổng thanh toán. Giới hạn tồn
          kho được kiểm tra bên dưới.
        </Text>

        {summary.errors.length > 0 ? (
          <View
            style={[styles.alert, { backgroundColor: t.dangerMuted }]}
            accessibilityRole="alert"
          >
            {summary.errors.map((msg) => (
              <Text key={msg} style={{ color: t.danger, marginBottom: 4 }}>
                {msg}
              </Text>
            ))}
          </View>
        ) : null}

        {summary.lines.map((line) => (
          <View
            key={line.listingId}
            style={[styles.line, { borderBottomColor: t.border }]}
          >
            <Text style={{ color: t.text, flex: 1 }}>
              {line.title} × {line.quantity}
            </Text>
            <Text style={{ color: t.text, fontWeight: '600' }}>
              {formatVnd(line.lineTotal)}
            </Text>
          </View>
        ))}

        <View style={styles.totals}>
          <Text style={{ color: t.textSecondary }}>{summary.deliveryRule}</Text>
          <Row label="Tạm tính" value={formatVnd(summary.subtotal)} color={t.text} />
          <Row label="Phí giao hàng" value={formatVnd(summary.deliveryFee)} color={t.text} />
          <Row label="Tổng cộng" value={formatVnd(summary.total)} color={t.tint} bold />
        </View>

        <AppButton
          label="Đặt hàng (Demo)"
          disabled={summary.lines.length === 0 || summary.errors.length > 0}
          onPress={async () => {
            // 1. Ghi nhận số lượng trừ tồn kho vào máy
            await deductStock(summary.lines);

            // 2. Kích hoạt tải lại danh mục để áp dụng tồn kho mới trên toàn app
            await queryClient.invalidateQueries({ queryKey: ['catalogue'] });

            // 3. Xóa giỏ hàng và quay về
            clear();
            router.back();
          }}
        />
        <AppButton label="Đóng" variant="ghost" onPress={() => router.back()} />
      </ScrollView>
    </ScreenState>
  );
}

function Row({
  label,
  value,
  color,
  bold,
}: {
  label: string;
  value: string;
  color: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={{ color, fontWeight: bold ? '800' : '500', fontSize: bold ? 18 : 15 }}>
        {label}
      </Text>
      <Text style={{ color, fontWeight: bold ? '800' : '600', fontSize: bold ? 18 : 15 }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40, gap: 8 },
  heading: { fontSize: 22, fontWeight: '800' },
  alert: { padding: 12, borderRadius: 10, marginBottom: 8 },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  totals: { gap: 8, marginVertical: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 28,
  },
});