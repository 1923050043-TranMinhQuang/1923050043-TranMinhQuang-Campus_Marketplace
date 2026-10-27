import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { useThemeTokens } from '@/hooks/useThemeTokens';

type Props = {
  status: 'loading' | 'empty' | 'error' | 'content';
  errorMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  children: ReactNode;
};

export function ScreenState({
  status,
  errorMessage,
  emptyTitle = 'Chưa có dữ liệu',
  emptyMessage = 'Vui lòng thử lại sau hoặc điều chỉnh bộ lọc của bạn.',
  onRetry,
  children,
}: Props) {
  const t = useThemeTokens();

  if (status === 'loading') {
    return (
      <View
        style={[styles.center, { backgroundColor: t.background }]}
        accessibilityRole="progressbar"
        accessibilityLabel="Đang tải dữ liệu"
      >
        <ActivityIndicator size="large" color={t.tint} />
        <Text style={[styles.message, { color: t.textSecondary }]}>Đang tải…</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={[styles.center, { backgroundColor: t.background }]}>
        <Text style={[styles.title, { color: t.danger }]}>Đã có lỗi xảy ra</Text>
        <Text style={[styles.message, { color: t.textSecondary }]}>
          {errorMessage ?? 'Vui lòng thử lại.'}
        </Text>
        {onRetry ? (
          <AppButton label="Thử lại" onPress={onRetry} style={styles.retry} />
        ) : null}
      </View>
    );
  }

  if (status === 'empty') {
    return (
      <View style={[styles.center, { backgroundColor: t.background }]}>
        <Text style={[styles.title, { color: t.text }]}>{emptyTitle}</Text>
        <Text style={[styles.message, { color: t.textSecondary }]}>
          {emptyMessage}
        </Text>
        {onRetry ? (
          <AppButton
            label="Làm mới"
            variant="secondary"
            onPress={onRetry}
            style={styles.retry}
          />
        ) : null}
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retry: {
    marginTop: 8,
    minWidth: 140,
  },
});