import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeTokens } from '@/hooks/useThemeTokens';
import { formatVnd } from '@/lib/checkout';
import { selectIsFavourite, useFavouritesStore } from '@/stores/favouritesStore';
import type { Listing } from '@/types/models';

type Props = {
  listing: Listing;
};

export function ListingCard({ listing }: Props) {
  const t = useThemeTokens();
  const isFavourite = useFavouritesStore(selectIsFavourite(listing.id));
  const toggle = useFavouritesStore((s) => s.toggle);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: t.surface, borderColor: t.border },
      ]}
    >
      <Link href={`/listing/${listing.id}`} asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`${listing.title}, ${formatVnd(listing.price)}`}
          style={styles.main}
        >
          <Image
            source={{ uri: listing.photoUri }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={`Hình ảnh của ${listing.title}`}
          />
          <View style={styles.meta}>
            <Text style={[styles.category, { color: t.textSecondary }]}>
              {listing.category}
            </Text>
            <Text style={[styles.title, { color: t.text }]} numberOfLines={2}>
              {listing.title}
            </Text>
            <Text style={[styles.price, { color: t.tint }]}>
              {formatVnd(listing.price)}
            </Text>
            <Text style={[styles.stock, { color: t.textSecondary }]}>
              {listing.stock > 0 ? `Còn ${listing.stock} sản phẩm` : 'Hết hàng'}
            </Text>
          </View>
        </Pressable>
      </Link>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isFavourite
            ? `Bỏ ${listing.title} khỏi danh sách yêu thích`
            : `Thêm ${listing.title} vào danh sách yêu thích`
        }
        accessibilityState={{ selected: isFavourite }}
        onPress={() => toggle(listing.id, listing.price)}
        style={[styles.fav, { borderColor: t.border }]}
        hitSlop={8}
      >
        <Text style={{ fontSize: 20, color: isFavourite ? t.danger : t.textSecondary }}>
          {isFavourite ? '♥' : '♡'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  main: {
    flexDirection: 'row',
    minHeight: 96,
  },
  image: {
    width: 96,
    height: 96,
    backgroundColor: 'transparent',
  },
  meta: {
    flex: 1,
    padding: 12,
    paddingRight: 44,
    gap: 2,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  stock: {
    fontSize: 13,
  },
  fav: {
    position: 'absolute',
    right: 8,
    top: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});