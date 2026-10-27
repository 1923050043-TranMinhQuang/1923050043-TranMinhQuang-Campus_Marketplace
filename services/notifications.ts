// services/notifications.ts
import { formatVnd } from '@/lib/checkout';
import { Platform } from 'react-native';

// 1. Kiểm tra an toàn trước khi load module expo-notifications trên Expo Go
let Notifications: typeof import('expo-notifications') | null = null;

try {
  // Tránh crash native module trên Expo Go Android
  Notifications = require('expo-notifications');
  if (Notifications && typeof Notifications.setNotificationHandler === 'function') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }
} catch (error) {
  // Bỏ qua lỗi thiếu module native khi chạy trên Expo Go
  console.warn('expo-notifications native module not available in this client:', error);
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web' || !Notifications) return false;
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  } catch (error) {
    console.warn('Failed to ensure notification permission:', error);
    return false;
  }
}

export async function notifyFavouritePriceChange(params: {
  title: string;
  oldPrice: number;
  newPrice: number;
}): Promise<void> {
  const allowed = await ensureNotificationPermission();
  if (!allowed || !Notifications) {
    console.log(
      `[Thông báo mô phỏng] Giá sản phẩm yêu thích thay đổi — ${params.title}: ${formatVnd(params.oldPrice)} → ${formatVnd(params.newPrice)}`
    );
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Giá sản phẩm yêu thích đã thay đổi!',
        body: `${params.title}: ${formatVnd(params.oldPrice)} → ${formatVnd(params.newPrice)}`,
        data: { type: 'favourite-price' },
      },
      trigger: null,
    });
  } catch (error) {
    console.warn('Failed to schedule local notification:', error);
  }
}