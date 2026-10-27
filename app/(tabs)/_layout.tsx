import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import { tokens } from '@/constants/tokens';
import { selectCartCount, useCartStore } from '@/stores/cartStore';
import { selectFavouriteIds, useFavouritesStore } from '@/stores/favouritesStore';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const t = tokens[colorScheme === 'dark' ? 'dark' : 'light'];
  const cartCount = useCartStore(selectCartCount);
  const favCount = useFavouritesStore(selectFavouriteIds).length;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: t.tabIconSelected,
        tabBarInactiveTintColor: t.tabIconDefault,
        tabBarStyle: { backgroundColor: t.surface, borderTopColor: t.border },
        headerStyle: { backgroundColor: t.surface },
        headerTintColor: t.text,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Khám phá',
          tabBarAccessibilityLabel: 'Khám phá danh sách sản phẩm',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'storefront', android: 'store', web: 'store' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Yêu thích',
          tabBarAccessibilityLabel: `Danh sách yêu thích, ${favCount} sản phẩm`,
          tabBarBadge: favCount > 0 ? favCount : undefined,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'heart', android: 'favorite', web: 'favorite' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Giỏ hàng',
          tabBarAccessibilityLabel: `Giỏ hàng, ${cartCount} sản phẩm`,
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'cart',
                android: 'shopping_cart',
                web: 'shopping_cart',
              }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Tài khoản',
          tabBarAccessibilityLabel: 'Tài khoản cá nhân',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'person', android: 'person', web: 'person' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}