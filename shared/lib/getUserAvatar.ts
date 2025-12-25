import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storageKeys';

/**
 * Получает URL аватара пользователя с fallback на сохраненное в локальном хранилище
 * @param currentAvatarUrl - Текущий URL аватара из токена или API
 * @param ticketPhoto - Фото из студенческого билета (приоритет выше)
 * @returns URL аватара или null
 */
export const getUserAvatar = async (
  currentAvatarUrl: string | null | undefined,
  ticketPhoto?: string | null,
): Promise<string | null> => {
  // Приоритет: ticketPhoto > currentAvatarUrl > сохраненное фото
  if (ticketPhoto) {
    return ticketPhoto;
  }

  if (currentAvatarUrl) {
    return currentAvatarUrl;
  }

  // Если текущего фото нет, используем сохраненное
  try {
    const storedAvatarUrl = await AsyncStorage.getItem(STORAGE_KEYS.USER_AVATAR_URL);
    return storedAvatarUrl || null;
  } catch {
    return null;
  }
};

/**
 * Синхронная версия для использования в компонентах (использует кеш)
 * @param currentAvatarUrl - Текущий URL аватара из токена (imeag) - приоритет самый высокий
 * @param ticketPhoto - Фото из студенческого билета (приоритет выше, чем stored)
 * @param storedAvatarUrl - Сохраненное фото (передается из store) - используется только если нет currentAvatarUrl
 * @returns URL аватара или null
 */
export const getUserAvatarSync = (
  currentAvatarUrl: string | null | undefined,
  ticketPhoto?: string | null,
  storedAvatarUrl?: string | null,
): string | null => {
  // Приоритет: currentAvatarUrl (из токена) > ticketPhoto > сохраненное фото
  // Всегда используем аватар из токена, если он есть
  if (currentAvatarUrl && currentAvatarUrl.trim() !== '') {
    return currentAvatarUrl;
  }

  // Если нет аватара в токене, используем фото из билета
  if (ticketPhoto && ticketPhoto.trim() !== '') {
    return ticketPhoto;
  }

  // В последнюю очередь используем сохраненное фото
  return storedAvatarUrl && storedAvatarUrl.trim() !== '' ? storedAvatarUrl : null;
};

