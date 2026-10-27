import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useFonts } from 'expo-font';
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  useRouter,
  useSegments,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { tokens } from '@/constants/tokens';
import { asyncStoragePersister, queryClient } from '@/lib/queryClient';
import {
  selectAuthHydrated,
  selectIsSignedIn,
  useAuthStore,
} from '@/stores/authStore';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore(selectAuthHydrated);
  const signedIn = useAuthStore(selectIsSignedIn);
  const hydrate = useAuthStore((s) => s.hydrate);
  const segments = useSegments();
  const router = useRouter();
  const scheme = useColorScheme();
  const t = tokens[scheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    const inAuth = segments[0] === '(auth)';
    if (!signedIn && !inAuth) {
      router.replace('/(auth)/sign-in');
    } else if (signedIn && inAuth) {
      router.replace('/(tabs)');
    }
  }, [hydrated, signedIn, segments, router]);

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.background,
        }}
      >
        <ActivityIndicator color={t.tint} size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const t = tokens[colorScheme === 'dark' ? 'dark' : 'light'];

  const navTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: t.tint,
      background: t.background,
      card: t.surface,
      text: t.text,
      border: t.border,
      notification: t.danger,
    },
  };

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <ThemeProvider value={navTheme}>
        <View style={{ flex: 1, backgroundColor: t.background }}>
          <AuthGate>
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: t.surface },
                headerTintColor: t.text,
                contentStyle: { backgroundColor: t.background },
              }}
            >
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="listing/[id]"
                options={{ title: 'Chi tiết sản phẩm', headerBackTitle: 'Quay lại' }}
              />
              <Stack.Screen
                name="listing/create"
                options={{ title: 'Đăng tin mới', presentation: 'card' }}
              />
              <Stack.Screen
                name="checkout"
                options={{ title: 'Thanh toán', presentation: 'modal' }}
              />
              <Stack.Screen name="+not-found" options={{ title: 'Không tìm thấy trang' }} />
            </Stack>
          </AuthGate>
        </View>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}