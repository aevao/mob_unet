import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'app_theme';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  isReady: boolean;
  setTheme: (theme: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  isReady: false,

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        set({ theme: stored, isReady: true });
      } else {
        set({ isReady: true });
      }
    } catch {
      set({ isReady: true });
    }
  },

  setTheme: async (theme) => {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    set({ theme });
  },

  toggleTheme: async () => {
    const current = get().theme;
    const next: ThemeMode = current === 'light' ? 'dark' : 'light';
    await get().setTheme(next);
  },
}));


