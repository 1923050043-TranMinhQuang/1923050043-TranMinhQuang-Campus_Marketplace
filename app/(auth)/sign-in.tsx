import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { ScreenState } from '@/components/ui/ScreenState';
import { useThemeTokens } from '@/hooks/useThemeTokens';
import { selectAuthHydrated, useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types/models';

export default function SignInScreen() {
  const t = useThemeTokens();
  const hydrated = useAuthStore(selectAuthHydrated);
  const signIn = useAuthStore((s) => s.signIn);
  const isBusy = useAuthStore((s) => s.isBusy);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [name, setName] = useState('Sinh viên A');
  const [password, setPassword] = useState('demo');
  const [role, setRole] = useState<UserRole>('buyer');

  if (!hydrated) {
    return <ScreenState status="loading">{null}</ScreenState>;
  }

  const onSubmit = async () => {
    clearError();
    try {
      await signIn(name, password, role);
      router.replace('/(tabs)');
    } catch {
      // error shown from store
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: t.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.brand, { color: t.tint }]}>Campus Marketplace</Text>
        <Text style={[styles.subtitle, { color: t.textSecondary }]}>
          Nền tảng mua bán & trao đổi đồ dùng sinh viên tiện lợi trong trường.
        </Text>

        <Text style={[styles.label, { color: t.text }]}>Họ và tên</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          accessibilityLabel="Họ và tên"
          placeholder="Nhập họ và tên của bạn"
          placeholderTextColor={t.placeholder}
          style={[
            styles.input,
            { color: t.text, borderColor: t.border, backgroundColor: t.inputBackground },
          ]}
        />

        <Text style={[styles.label, { color: t.text }]}>Mật khẩu</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          accessibilityLabel="Mật khẩu"
          placeholder="Nhập mật khẩu"
          placeholderTextColor={t.placeholder}
          secureTextEntry
          style={[
            styles.input,
            { color: t.text, borderColor: t.border, backgroundColor: t.inputBackground },
          ]}
        />

        <Text style={[styles.label, { color: t.text }]}>Tôi là…</Text>
        <View style={styles.roles}>
          {(['buyer', 'seller'] as UserRole[]).map((option) => {
            const selected = role === option;
            const roleLabel = option === 'buyer' ? 'Người mua' : 'Người bán';
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Vai trò ${roleLabel}`}
                onPress={() => {
                  setRole(option);
                  setName(option === 'buyer' ? 'Sinh viên A' : 'Sinh viên B');
                  setPassword('demo');
                }}
                style={[
                  styles.roleChip,
                  {
                    backgroundColor: selected ? t.tint : t.surfaceMuted,
                    borderColor: selected ? t.tint : t.border,
                  },
                ]}
              >
                <Text style={{ color: selected ? t.onTint : t.text, fontWeight: '600' }}>
                  {roleLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {error ? (
          <Text
            style={[styles.error, { color: t.danger }]}
            accessibilityRole="alert"
          >
            {error}
          </Text>
        ) : null}

        <AppButton label="Đăng nhập" onPress={onSubmit} loading={isBusy} />

        <Text style={[styles.hint, { color: t.textSecondary }]}>
          Tài khoản demo: Sinh viên A (Người mua) · Sinh viên B (Người bán) · Mật khẩu: demo
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 8,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 44,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  roles: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  roleChip: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 14,
    marginVertical: 4,
  },
  hint: {
    fontSize: 13,
    marginTop: 16,
    lineHeight: 18,
    textAlign: 'center',
  },
});