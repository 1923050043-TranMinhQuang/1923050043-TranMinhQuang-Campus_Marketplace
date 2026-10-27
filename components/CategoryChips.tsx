import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useThemeTokens } from '@/hooks/useThemeTokens';
import { LISTING_CATEGORIES, type ListingCategory } from '@/types/models';

type CategoryFilter = ListingCategory | 'All';

type Props = {
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
};

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  All: 'Tất cả',
  Textbooks: 'Phụ kiện',
  Electronics: 'Đồ điện tử',
  Furniture: 'Nội thất',
  Clothing: 'Quần áo',
  Stationery: 'Dụng cụ học tập',
  Dorm: 'Đồ ký túc xá',
  Bikes: 'Xe đạp',
  Other: 'Khác',
};

const OPTIONS: CategoryFilter[] = ['All', ...LISTING_CATEGORIES];

export function CategoryChips({ value, onChange }: Props) {
  const t = useThemeTokens();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
    >
      {OPTIONS.map((option) => {
        const selected = option === value;
        const displayLabel = CATEGORY_TRANSLATIONS[option] ?? option;

        return (
          <Pressable
            key={option}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`Danh mục ${displayLabel}`}
            onPress={() => onChange(option)}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? t.tint : t.surfaceMuted,
                borderColor: selected ? t.tint : t.border,
              },
            ]}
          >
            <Text
              style={{
                color: selected ? t.onTint : t.text,
                fontWeight: '600',
                fontSize: 14,
              }}
            >
              {displayLabel}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});