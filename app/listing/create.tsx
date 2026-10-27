import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
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
import { catalogueQueryKey } from '@/lib/queryClient';
import { createListing } from '@/services/api';
import {
  formatBytes,
  pickAndCompressListingPhoto,
  type CompressedPhoto,
} from '@/services/images';
import { selectUser, useAuthStore } from '@/stores/authStore';
import {
  LISTING_CATEGORIES,
  type ListingCategory,
} from '@/types/models';

/** Bản dịch chuẩn khớp 100% với các tab danh mục ở trang chủ */
const CATEGORY_TRANSLATIONS: Record<ListingCategory, string> = {
  Textbooks: 'Phụ kiện',
  Electronics: 'Đồ điện tử',
  Furniture: 'Nội thất',
  Clothing: 'Quần áo',
  Other: 'Khác',
};

export default function CreateListingScreen() {
  const t = useThemeTokens();
  const user = useAuthStore(selectUser);
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('50000');
  const [stock, setStock] = useState('1');
  const [category, setCategory] = useState<ListingCategory>('Textbooks');
  const [photo, setPhoto] = useState<CompressedPhoto | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <ScreenState
        status="empty"
        emptyTitle="Yêu cầu đăng nhập"
        emptyMessage="Bạn cần có tài khoản để đăng tin bán sản phẩm."
        onRetry={() => router.replace('/(auth)/sign-in')}
      >
        {null}
      </ScreenState>
    );
  }

  if (user.role !== 'seller') {
    return (
      <ScreenState
        status="empty"
        emptyTitle="Chỉ dành cho người bán"
        emptyMessage="Vui lòng đăng nhập bằng tài khoản người bán để đăng tin."
        onRetry={() => router.back()}
      >
        {null}
      </ScreenState>
    );
  }

  const pickPhoto = async (source: 'camera' | 'library') => {
    setError(null);
    try {
      const result = await pickAndCompressListingPhoto(source);
      setPhoto(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể lấy ảnh chụp hoặc từ thư viện.');
    }
  };

  const onSubmit = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài đăng.');
      return;
    }
    if (!photo) {
      setError('Vui lòng chụp hoặc chọn ít nhất 1 hình ảnh.');
      return;
    }
    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setError('Vui lòng nhập giá bán hợp lệ.');
      return;
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      setError('Vui lòng nhập số lượng tồn kho hợp lệ.');
      return;
    }

    setBusy(true);
    try {
      await createListing({
        title: title.trim(),
        description: description.trim() || 'Sản phẩm trao đổi trong trường',
        price: priceNum,
        stock: stockNum,
        category,
        photoUri: photo.uri,
        sellerId: user.id,
        sellerName: user.name,
      });

      // Làm mới dữ liệu toàn ứng dụng
      await queryClient.invalidateQueries({ queryKey: catalogueQueryKey });

      Alert.alert('Thành công', 'Đã đăng tin sản phẩm thành công!', [
        {
          text: 'Đồng ý',
          onPress: () => router.back(),
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể tạo bài đăng.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: t.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ ...styles.label, color: t.text }}>Tiêu đề sản phẩm</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        accessibilityLabel="Tiêu đề sản phẩm"
        placeholder="Ví dụ: Tai nghe, balo cũ, Chuột không dây..."
        placeholderTextColor={t.placeholder}
        style={{
          ...styles.input,
          color: t.text,
          borderColor: t.border,
          backgroundColor: t.inputBackground,
        }}
      />

      <Text style={{ ...styles.label, color: t.text }}>Mô tả chi tiết</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        accessibilityLabel="Mô tả chi tiết bài đăng"
        placeholder="Tình trạng đồ dùng, vị trí hẹn giao (thư viện, cổng trường)..."
        placeholderTextColor={t.placeholder}
        multiline
        style={{
          ...styles.input,
          ...styles.multiline,
          color: t.text,
          borderColor: t.border,
          backgroundColor: t.inputBackground,
        }}
      />

      <Text style={{ ...styles.label, color: t.text }}>Danh mục</Text>
      <View style={styles.chips}>
        {LISTING_CATEGORIES.map((option) => {
          const selected = category === option;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Danh mục ${CATEGORY_TRANSLATIONS[option] ?? option}`}
              onPress={() => setCategory(option)}
              style={{
                ...styles.chip,
                backgroundColor: selected ? t.tint : t.surfaceMuted,
                borderColor: selected ? t.tint : t.border,
              }}
            >
              <Text style={{ color: selected ? t.onTint : t.text, fontWeight: '600' }}>
                {CATEGORY_TRANSLATIONS[option] ?? option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={{ ...styles.label, color: t.text }}>Giá bán (VNĐ)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        accessibilityLabel="Giá bán bằng VNĐ"
        keyboardType="numeric"
        style={{
          ...styles.input,
          color: t.text,
          borderColor: t.border,
          backgroundColor: t.inputBackground,
        }}
      />

      <Text style={{ ...styles.label, color: t.text }}>Số lượng tồn kho</Text>
      <TextInput
        value={stock}
        onChangeText={setStock}
        accessibilityLabel="Số lượng tồn kho"
        keyboardType="number-pad"
        style={{
          ...styles.input,
          color: t.text,
          borderColor: t.border,
          backgroundColor: t.inputBackground,
        }}
      />

      <Text style={{ ...styles.label, color: t.text }}>Hình ảnh sản phẩm</Text>
      <View style={styles.photoActions}>
        <AppButton
          label="Máy ảnh"
          variant="secondary"
          onPress={() => {
            void pickPhoto('camera');
          }}
          style={styles.flexBtn}
        />
        <AppButton
          label="Thư viện ảnh"
          variant="secondary"
          onPress={() => {
            void pickPhoto('library');
          }}
          style={styles.flexBtn}
        />
      </View>

      {photo ? (
        <View
          style={{
            ...styles.proof,
            backgroundColor: t.tintMuted,
            borderColor: t.tint,
          }}
          accessibilityRole="summary"
        >
          <Image
            source={{ uri: photo.uri }}
            style={styles.preview}
            accessibilityLabel="Xem trước ảnh chụp sản phẩm đã nén"
          />
          <Text style={{ color: t.text, fontWeight: '700' }}>
            Tối ưu hóa hình ảnh (Tiết kiệm băng thông)
          </Text>
          <Text style={{ color: t.text }}>
            Ảnh gốc (Trước khi nén): {formatBytes(photo.originalBytesEstimate)}
          </Text>
          <Text style={{ color: t.text }}>
            Sau khi nén: {formatBytes(photo.compressedBytesEstimate)}
          </Text>
          <Text style={{ color: t.textSecondary }}>
            Độ phân giải tối ưu ({photo.width}×{photo.height})
          </Text>
        </View>
      ) : (
        <Text style={{ color: t.textSecondary }}>
          Vui lòng chụp ảnh hoặc chọn ảnh từ thư viện máy.
        </Text>
      )}

      {error ? (
        <Text style={{ color: t.danger }} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <AppButton label="Đăng tin ngay" loading={busy} onPress={() => void onSubmit()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 8, paddingBottom: 40 },
  label: { fontWeight: '600', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 44,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  multiline: {
    minHeight: 88,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoActions: { flexDirection: 'row', gap: 10 },
  flexBtn: { flex: 1 },
  proof: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
});