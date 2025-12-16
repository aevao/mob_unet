import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { create } from 'zustand';
import { STORAGE_KEYS } from '../../../shared/lib/storageKeys';
import { apiClient } from '../../../shared/api/client';
import { decodeUserFromToken } from '../../../shared/lib/decodeUserFromToken';

const API_BASE_URL = 'https://uadmin.kstu.kg';

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
  hasPinCode: boolean;
  isBiometricEnabled: boolean;
  initialize: () => Promise<void>;
  login: (params: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (tokens: { accessToken: string; refreshToken?: string }) => Promise<void>;
  setPinCode: (pin: string) => Promise<void>;
  verifyPinCode: (pin: string) => Promise<boolean>;
  clearPinCode: () => Promise<void>;
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
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
  storedAvatarUrl: null,
  isInitialized: false,
  isLoading: false,
  error: null,
  hasPinCode: false,
  isBiometricEnabled: false,

  initialize: async () => {
    try {
      // Проверяем наличие refreshToken в SecureStore (защищенное хранилище)
      const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const pinCode = await SecureStore.getItemAsync(STORAGE_KEYS.PIN_CODE);
      const biometricEnabled = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
      const storedAvatarUrl = await AsyncStorage.getItem(STORAGE_KEYS.USER_AVATAR_URL);

      const decodedUser = buildUser(accessToken);

      set({
        accessToken,
        refreshToken,
        user: decodedUser,
        storedAvatarUrl,
        hasPinCode: !!pinCode,
        isBiometricEnabled: biometricEnabled === 'true',
        isInitialized: true,
      });
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

      // Сохраняем accessToken в AsyncStorage (для быстрого доступа)
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
      
      // Сохраняем refreshToken в SecureStore (защищенное хранилище)
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refresh);

      const user = buildUser(access);
      
      // Сохраняем фото пользователя в локальное хранилище
      if (user?.avatarUrl) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_AVATAR_URL, user.avatarUrl);
      }
      
      set({ 
        accessToken: access,
        refreshToken: refresh,
        user,
        storedAvatarUrl: user?.avatarUrl || null,
        isLoading: false, 
        error: null,
      });
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
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.BIOMETRIC_ENABLED,
      STORAGE_KEYS.USER_AVATAR_URL,
    ]);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.PIN_CODE);
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      storedAvatarUrl: null,
      error: null,
      hasPinCode: false,
      isBiometricEnabled: false,
    });
  },

  setTokens: async ({ accessToken, refreshToken }) => {
    // Сохраняем accessToken в AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

    // Сохраняем refreshToken в SecureStore (защищенное хранилище)
    if (refreshToken) {
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    const user = buildUser(accessToken);
    
    // Обновляем фото пользователя в локальном хранилище, если оно изменилось
    let finalStoredAvatarUrl = user?.avatarUrl || null;
    if (user?.avatarUrl) {
      const storedAvatarUrl = await AsyncStorage.getItem(STORAGE_KEYS.USER_AVATAR_URL);
      if (storedAvatarUrl !== user.avatarUrl) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_AVATAR_URL, user.avatarUrl);
        finalStoredAvatarUrl = user.avatarUrl;
      } else {
        finalStoredAvatarUrl = storedAvatarUrl;
      }
    }
    
    set({ 
      accessToken, 
      refreshToken: refreshToken || null, 
      user,
      storedAvatarUrl: finalStoredAvatarUrl,
    });
  },

  setPinCode: async (pin: string) => {
    await SecureStore.setItemAsync(STORAGE_KEYS.PIN_CODE, pin);
    set({ hasPinCode: true });
  },

  verifyPinCode: async (pin: string): Promise<boolean> => {
    try {
      const storedPin = await SecureStore.getItemAsync(STORAGE_KEYS.PIN_CODE);
      return storedPin === pin;
    } catch {
      return false;
    }
  },

  clearPinCode: async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.PIN_CODE);
    await AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
    set({ hasPinCode: false, isBiometricEnabled: false });
  },

  setBiometricEnabled: async (enabled: boolean) => {
    await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled ? 'true' : 'false');
    set({ isBiometricEnabled: enabled });
  },

  refreshAccessToken: async (): Promise<boolean> => {
    try {
      // Читаем refreshToken из SecureStore
      const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        return false;
      }

      // Используем axios напрямую, чтобы избежать циклических зависимостей
      const response = await axios.post(
        `${API_BASE_URL}/user/api/v1/users/refresh/`,
        { refresh: refreshToken },
      );

      const { access, refresh } = response.data;
      await get().setTokens({ accessToken: access, refreshToken: refresh });
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  },

}));


