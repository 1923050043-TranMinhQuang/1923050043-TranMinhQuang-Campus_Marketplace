import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { User, UserRole } from '@/types/models';

const SESSION_KEY = 'campus.session';

export const DEMO_USERS: Array<User & { password: string }> = [
  { id: 'u-buyer', name: 'Sinh viên A', role: 'buyer', password: 'demo' },
  { id: 'u-seller', name: 'Sinh viên B', role: 'seller', password: 'demo' },
];

export type SessionPayload = {
  token: string;
  user: User;
};

function makeToken(userId: string): string {
  return `tok_${userId}_${Date.now()}`;
}

async function setSecret(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(SESSION_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(SESSION_KEY, value);
}

async function getSecret(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(SESSION_KEY);
  }
  return SecureStore.getItemAsync(SESSION_KEY);
}

async function deleteSecret(): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(SESSION_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function signIn(
  name: string,
  password: string,
  role: UserRole,
): Promise<SessionPayload> {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    throw new Error('Vui lòng nhập tên của bạn (tối thiểu 2 ký tự).');
  }

  // Chấp nhận mật khẩu 'demo' 
  const passwordOk =
    password === 'demo'
  if (!passwordOk) {
    throw new Error('Sai mật khẩu. Vui lòng nhập lại');
  }

  const demo = DEMO_USERS.find((u) => u.role === role);

  const user: User = {
    id: demo?.id ?? `u-${role}-${trimmed.toLowerCase().replace(/\s+/g, '-')}`,
    name: trimmed,
    role,
  };

  const session: SessionPayload = { token: makeToken(user.id), user };
  await setSecret(JSON.stringify(session));
  return session;
}

export async function signOut(): Promise<void> {
  await deleteSecret();
}

export async function loadSession(): Promise<SessionPayload | null> {
  const raw = await getSecret();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionPayload;
  } catch {
    await deleteSecret();
    return null;
  }
}