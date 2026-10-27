import { create } from 'zustand';

import * as authService from '@/services/auth';
import type { User, UserRole } from '@/types/models';

type AuthState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  isBusy: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  signIn: (name: string, password: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,
  isBusy: false,
  error: null,

  hydrate: async () => {
    try {
      const session = await authService.loadSession();
      set({
        user: session?.user ?? null,
        token: session?.token ?? null,
        hydrated: true,
        error: null,
      });
    } catch {
      set({ user: null, token: null, hydrated: true });
    }
  },

  signIn: async (name, password, role) => {
    set({ isBusy: true, error: null });
    try {
      const session = await authService.signIn(name, password, role);
      set({
        user: session.user,
        token: session.token,
        isBusy: false,
        error: null,
      });
    } catch (e) {
      set({
        isBusy: false,
        error: e instanceof Error ? e.message : 'Sign in failed.',
      });
      throw e;
    }
  },

  signOut: async () => {
    set({ isBusy: true, error: null });
    await authService.signOut();
    set({ user: null, token: null, isBusy: false });
  },

  clearError: () => set({ error: null }),
}));

export const selectUser = (s: AuthState) => s.user;
export const selectIsSignedIn = (s: AuthState) => Boolean(s.token && s.user);
export const selectAuthHydrated = (s: AuthState) => s.hydrated;
