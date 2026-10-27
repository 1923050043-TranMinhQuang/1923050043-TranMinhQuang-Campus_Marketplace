import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

export type CompressedPhoto = {
  uri: string;
  originalBytesEstimate: number;
  compressedBytesEstimate: number;
  width: number;
  height: number;
};

async function estimateUriBytes(uri: string): Promise<number> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob.size;
  } catch {
    return 0;
  }
}

/**
 * Chụp hoặc chọn ảnh từ thư viện, sau đó nén để tối ưu khi dùng wifi trường.
 * Trả về ước lượng dung lượng trước và sau nén để minh chứng trên UI.
 */
export async function pickAndCompressListingPhoto(
  source: 'camera' | 'library',
): Promise<CompressedPhoto> {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      source === 'camera'
        ? 'Cần cấp quyền truy cập máy ảnh để chụp ảnh sản phẩm.'
        : 'Cần cấp quyền truy cập thư viện để chọn ảnh sản phẩm.',
    );
  }

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 1,
          allowsEditing: true,
          aspect: [4, 3],
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 1,
          allowsEditing: true,
          aspect: [4, 3],
        });

  if (result.canceled || !result.assets[0]) {
    throw new Error('Chưa chọn ảnh nào.');
  }

  const asset = result.assets[0];
  const originalBytesEstimate =
    asset.fileSize && asset.fileSize > 0
      ? asset.fileSize
      : await estimateUriBytes(asset.uri);

  const manipulated = await ImageManipulator.manipulateAsync(
    asset.uri,
    [{ resize: { width: 1280 } }],
    {
      compress: 0.55,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );

  const compressedBytesEstimate = await estimateUriBytes(manipulated.uri);

  return {
    uri: manipulated.uri,
    originalBytesEstimate,
    compressedBytesEstimate:
      compressedBytesEstimate || Math.round(originalBytesEstimate * 0.25),
    width: manipulated.width,
    height: manipulated.height,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}