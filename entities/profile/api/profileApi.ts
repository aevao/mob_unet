import { apiClient } from '../../../shared/api/client';
import type { UpdateProfileRequest, Profile } from '../types';

/**
 * Получение профиля пользователя
 */
export const getProfile = async (): Promise<Profile> => {
  const response = await apiClient.get('/user/api/v1/users/profile/');
  return response.data;
};

/**
 * Обновление профиля пользователя
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<Profile> => {
  const response = await apiClient.patch('/user/api/v1/users/profile/', data);
  return response.data;
};

/**
 * Загрузка аватара
 */
export const uploadAvatar = async (avatarUri: string): Promise<{ avatarUrl: string }> => {
  // Создаем FormData для загрузки файла
  const formData = new FormData();
  
  // Определяем тип файла
  const fileExtension = avatarUri.split('.').pop()?.toLowerCase() || 'jpg';
  const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
  
  // Добавляем файл в FormData
  formData.append('avatar', {
    uri: avatarUri,
    type: mimeType,
    name: `avatar.${fileExtension}`,
  } as any);
  
  const response = await apiClient.post('/user/api/v1/users/profile/avatar/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

