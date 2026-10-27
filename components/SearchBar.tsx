import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useThemeTokens } from '@/hooks/useThemeTokens';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export function SearchBar({ value, onChangeText }: Props) {
  const t = useThemeTokens();
  const [text, setText] = useState(value);

  // Đồng bộ lại khi giá trị bên ngoài bị xóa rỗng
  useEffect(() => {
    setText(value);
  }, [value]);

  const handleChangeText = (val: string) => {
    setText(val);
    onChangeText(val);
  };

  return (
    <View style={[styles.wrap, { backgroundColor: t.inputBackground, borderColor: t.border }]}>
      <TextInput
        value={text}
        onChangeText={handleChangeText}
        placeholder="Tìm kiếm sản phẩm, phụ kiện..."
        placeholderTextColor={t.placeholder}
        accessibilityLabel="Tìm kiếm sản phẩm"
        accessibilityRole="search"
        style={[styles.input, { color: t.text }]}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="default"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  input: {
    fontSize: 16,
    minHeight: 44,
    paddingVertical: 8,
  },
});