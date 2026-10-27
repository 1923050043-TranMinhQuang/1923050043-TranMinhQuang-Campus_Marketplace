import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeTokens } from '@/hooks/useThemeTokens';

export default function NotFoundScreen() {
  const t = useThemeTokens();

  return (
    <>
      <Stack.Screen options={{ title: 'Rất tiếc!' }} />
      <View style={[styles.container, { backgroundColor: t.background }]}>
        <Text style={[styles.title, { color: t.text }]}>Không tìm thấy trang</Text>
        <Text style={{ color: t.textSecondary, textAlign: 'center' }}>
          Đường dẫn này không tồn tại. Hãy quay lại danh mục sản phẩm của trường.
        </Text>
        <Link
          href="/"
          style={styles.link}
          accessibilityRole="link"
          accessibilityLabel="Quay về trang khám phá"
        >
          <Text style={{ color: t.tint, fontWeight: '700', fontSize: 16 }}>
            Về trang Khám phá
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  link: {
    marginTop: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
});