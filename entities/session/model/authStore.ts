import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { STORAGE_KEYS } from '../../../shared/lib/storageKeys';
import { apiClient } from '../../../shared/api/client';
import { decodeUserFromToken } from '../../../shared/lib/decodeUserFromToken';

export type UserRole = 'student' | 'teacher' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string | null;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  surname: string | null;
  phone: string | null;
  avatarUrl: string | null;
  gender: string | null;
  birthDate: string | null;
  userType: string | null;
  alertNumber: number;
  raw?: Record<string, unknown>;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (params: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (tokens: { accessToken: string; refreshToken?: string }) => Promise<void>;
}

const buildUser = (token?: string | null): User | null => {
  const decoded = decodeUserFromToken(token);
  if (!decoded) return null;

  let role: UserRole = 'employee';
  if (decoded.userType === 'S') {
    role = 'student';
  } else if (decoded.userType === 'T') {
    role = 'teacher';
  }

  return {
    id: decoded.id,
    name: decoded.name,
    email: decoded.email,
    role,
    firstName: decoded.firstName,
    lastName: decoded.lastName,
    surname: decoded.surname,
    phone: decoded.phone,
    avatarUrl: decoded.avatarUrl,
    gender: decoded.gender,
    birthDate: decoded.birthDate,
    userType: decoded.userType,
    alertNumber: decoded.alertNumber,
    raw: decoded.raw,
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isInitialized: false,
  isLoading: false,
  error: null,

  initialize: async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);

      const decodedUser = buildUser(accessToken);

      set({ accessToken, refreshToken, user: decodedUser, isInitialized: true });
    } catch (error) {
      set({ isInitialized: true });
    }
  },

  login: async ({ username, password }) => {
    set({ isLoading: true, error: null });
    try {
      // Ваш бекенд: POST /user/api/v1/users/auth/
      // Ожидаем, что ответ содержит { access, refresh, user }
      const response = await apiClient.post('/user/api/v1/users/auth/', {
        username,
        password,
      });

      const { access, refresh } = response.data;

      await get().setTokens({ accessToken: access, refreshToken: refresh });
      set({ isLoading: false, error: null });
    } catch (error: any) {
      let message = 'Ошибка авторизации. Попробуйте еще раз.';
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      }
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      error: null,
    });
  },

  setTokens: async ({ accessToken, refreshToken }) => {
    const updates: Partial<AuthState> = { accessToken };
    const storageOps: [string, string][] = [[STORAGE_KEYS.ACCESS_TOKEN, accessToken]];

    if (refreshToken) {
      updates.refreshToken = refreshToken;
      storageOps.push([STORAGE_KEYS.REFRESH_TOKEN, refreshToken]);
    }

    await AsyncStorage.multiSet(storageOps);
    const user = buildUser(accessToken);
    set({ ...updates, user });
  },
}));


