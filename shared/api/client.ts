import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { useAuthStore } from '../../entities/session/model/authStore';

// Базовый URL вашего бэкенда
const API_BASE_URL = 'https://uadmin.kstu.kg';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const state = useAuthStore.getState();
  const token = state.accessToken || (await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const state = useAuthStore.getState();
        const refreshToken =
          state.refreshToken || (await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN));

        if (!refreshToken) {
          state.logout();
          return Promise.reject(error);
        }

        // Предполагаем, что рефреш-токен обновляется по этому эндпоинту.
        // Если у вас другой путь/формат — нужно будет поправить ниже.
        const refreshResponse = await axios.post(
          '/user/api/v1/users/auth/refresh',
          { refreshToken },
          { baseURL: API_BASE_URL },
        );

        const { access, refresh } = refreshResponse.data;

        await state.setTokens({ accessToken: access, refreshToken: refresh });

        originalRequest.headers.Authorization = `Bearer ${access}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        const state = useAuthStore.getState();
        state.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);


