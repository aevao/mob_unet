import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { STORAGE_KEYS } from './storageKeys';

/**
 * Проверяет, является ли строка URL
 */
const isUrl = (str: string | null | undefined): boolean => {
  if (!str) return false;
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Проверяет, является ли строка base64 изображением
 */
const isBase64Image = (str: string | null | undefined): boolean => {
  if (!str) return false;
  // Проверяем паттерны base64 изображений
  const base64ImagePattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/i;
  return base64ImagePattern.test(str);
};

/**
 * Сохраняет аватарку в локальное хранилище
 * - Если это URL - сохраняет URL в AsyncStorage
 * - Если это base64 - сохраняет как файл и путь в AsyncStorage
 */
export const saveAvatar = async (avatarData: string | null | undefined): Promise<string | null> => {
  if (!avatarData) {
    // Очищаем сохраненную аватарку, если данные пустые
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_AVATAR_URL);
    return null;
  }

  try {
    // Если это URL - просто сохраняем в AsyncStorage
    if (isUrl(avatarData)) {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_AVATAR_URL, avatarData);
      return avatarData;
    }

    // Если это base64 изображение
    if (isBase64Image(avatarData)) {
      // Определяем расширение файла из data URI
      const match = avatarData.match(/^data:image\/(\w+);base64,/i);
      const extension = match ? match[1] : 'jpg';
      
      // Создаем путь для сохранения файла
      const fileName = `avatar_${Date.now()}.${extension}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Извлекаем base64 данные (без префикса data:image/...)
      const base64Data = avatarData.split(',')[1];
      
      // Сохраняем файл
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Сохраняем путь к файлу в AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_AVATAR_URL, fileUri);
      
      // Удаляем старый файл аватарки, если он существует
      try {
        const oldAvatarUri = await AsyncStorage.getItem(STORAGE_KEYS.USER_AVATAR_URL);
        if (oldAvatarUri && oldAvatarUri.startsWith(FileSystem.documentDirectory)) {
          const fileInfo = await FileSystem.getInfoAsync(oldAvatarUri);
          if (fileInfo.exists && oldAvatarUri !== fileUri) {
            await FileSystem.deleteAsync(oldAvatarUri, { idempotent: true });
          }
        }
      } catch (error) {
        // Игнорируем ошибки при удалении старого файла
        console.warn('Failed to delete old avatar file:', error);
      }
      
      return fileUri;
    }

    // Если это просто base64 без префикса data:image/...
    // Сохраняем как файл (предполагаем jpg)
    if (avatarData.length > 100 && /^[A-Za-z0-9+/=]+$/.test(avatarData)) {
      const fileName = `avatar_${Date.now()}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, avatarData, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_AVATAR_URL, fileUri);
      
      return fileUri;
    }

    // Если формат не распознан, сохраняем как есть в AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.USER_AVATAR_URL, avatarData);
    return avatarData;
  } catch (error) {
    console.error('Failed to save avatar:', error);
    // В случае ошибки все равно пытаемся сохранить в AsyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_AVATAR_URL, avatarData);
      return avatarData;
    } catch {
      return null;
    }
  }
};

/**
 * Получает сохраненную аватарку из локального хранилища
 */
export const getStoredAvatar = async (): Promise<string | null> => {
  try {
    const storedAvatar = await AsyncStorage.getItem(STORAGE_KEYS.USER_AVATAR_URL);
    if (!storedAvatar) return null;

    // Если это путь к файлу, проверяем его существование
    if (storedAvatar.startsWith(FileSystem.documentDirectory)) {
      const fileInfo = await FileSystem.getInfoAsync(storedAvatar);
      if (fileInfo.exists) {
        return storedAvatar;
      }
      // Файл не существует, удаляем из хранилища
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_AVATAR_URL);
      return null;
    }

    // Если это URL или другой формат
    return storedAvatar;
  } catch (error) {
    console.error('Failed to get stored avatar:', error);
    return null;
  }
};

/**
 * Очищает сохраненную аватарку
 */
export const clearStoredAvatar = async (): Promise<void> => {
  try {
    const storedAvatar = await AsyncStorage.getItem(STORAGE_KEYS.USER_AVATAR_URL);
    
    // Если это файл, удаляем его
    if (storedAvatar && storedAvatar.startsWith(FileSystem.documentDirectory)) {
      await FileSystem.deleteAsync(storedAvatar, { idempotent: true });
    }
    
    // Удаляем из AsyncStorage
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_AVATAR_URL);
  } catch (error) {
    console.error('Failed to clear stored avatar:', error);
  }
};

