import { StyleSheet, Text, View } from 'react-native';

import { useThemeTokens } from '@/hooks/useThemeTokens';

type Props = {
  visible: boolean;
  lastUpdated?: string | null;
};

export function OfflineBanner({ visible, lastUpdated }: Props) {
  const t = useThemeTokens();
  if (!visible) return null;

  const when = lastUpdated
    ? new Date(lastUpdated).toLocaleString('vi-VN')
    : 'thời gian không xác định';

  return (
    <View
      style={[styles.banner, { backgroundColor: t.offlineBanner }]}
      accessibilityRole="alert"
      accessibilityLabel={`Đang ngoại tuyến. Hiển thị danh mục gần nhất từ ${when}`}
    >
      <Text style={[styles.text, { color: t.offline }]}>
        Ngoại tuyến — đang hiển thị danh mục lưu gần nhất ({when})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});