import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { ScreenState } from '@/components/ui/ScreenState';
import { useThemeTokens } from '@/hooks/useThemeTokens';
import {
  selectIsSignedIn,
  selectUser,
  useAuthStore,
} from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

export default function AccountScreen() {
  const t = useThemeTokens();
  const user = useAuthStore(selectUser);
  const signedIn = useAuthStore(selectIsSignedIn);
  const signOut = useAuthStore((s) => s.signOut);
  const isBusy = useAuthStore((s) => s.isBusy);
  const clearCart = useCartStore((s) => s.clear);

  if (!signedIn || !user) {
    return (
      <ScreenState
        status="empty"
        emptyTitle="Chưa đăng nhập"
        emptyMessage="Vui lòng đăng nhập để quản lý tài khoản của bạn."
        onRetry={() => router.replace('/(auth)/sign-in')}
      >
        {null}
      </ScreenState>
    );
  }

  const onSignOut = async () => {
    clearCart();
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <View style={[styles.container, { backgroundColor: t.background }]}>
      <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
        <Text style={[styles.label, { color: t.textSecondary }]}>Đang đăng nhập với tên</Text>
        <Text style={[styles.name, { color: t.text }]}>{user.name}</Text>
        <Text style={[styles.role, { color: t.tint }]}>
          Vai trò: {user.role === 'seller' ? 'Người bán (Seller)' : 'Người mua (Buyer)'}
        </Text>
        <Text style={{ color: t.textSecondary, marginTop: 8 }}>
          Phiên đăng nhập được lưu trữ an toàn. Đăng xuất sẽ xóa sạch toàn bộ phiên làm việc.
        </Text>
      </View>

      {user.role === 'seller' ? (
        <AppButton
          label="Đăng tin bán mới"
          onPress={() => router.push('/listing/create')}
        />
      ) : (
        <Text style={{ color: t.textSecondary }}>
          Với vai trò người mua, bạn có thể xem danh mục, lưu yêu thích và đặt hàng.
          Đổi sang tài khoản người bán để đăng tin rao vặt.
        </Text>
      )}

      <AppButton
        label="Đăng xuất"
        variant="danger"
        loading={isBusy}
        onPress={() => {
          void onSignOut();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  label: { fontSize: 13 },
  name: { fontSize: 22, fontWeight: '700' },
  role: { fontSize: 15, fontWeight: '600' },
});