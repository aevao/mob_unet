import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../shared/lib/storageKeys';
import { useAuthStore } from '../../../entities/session/model/authStore';

export const useAvatarUpload = () => {
  const { storedAvatarUrl, setStoredAvatarUrl } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = useCallback(async () => {
    try {
      // Запрашиваем разрешение на доступ к галерее
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Разрешение требуется',
          'Для загрузки фото необходимо разрешение на доступ к галерее'
        );
        return null;
      }

      // Открываем галерею для выбора изображения
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать изображение');
      return null;
    }
  }, []);

  const takePhoto = useCallback(async () => {
    try {
      // Запрашиваем разрешение на доступ к камере
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Разрешение требуется',
          'Для съемки фото необходимо разрешение на доступ к камере'
        );
        return null;
      }

      // Открываем камеру
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Ошибка', 'Не удалось сделать фото');
      return null;
    }
  }, []);

  const showImagePickerOptions = useCallback(() => {
    Alert.alert(
      'Выберите фото',
      'Откуда вы хотите загрузить фото?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Камера', onPress: async () => {
          const uri = await takePhoto();
          if (uri) {
            await uploadAvatar(uri);
          }
        }},
        { text: 'Галерея', onPress: async () => {
          const uri = await pickImage();
          if (uri) {
            await uploadAvatar(uri);
          }
        }},
      ]
    );
  }, [pickImage, takePhoto]);

  const uploadAvatar = useCallback(async (imageUri: string) => {
    try {
      setIsUploading(true);

      // TODO: Заменить на реальный API вызов для загрузки изображения
      // const formData = new FormData();
      // formData.append('avatar', {
      //   uri: imageUri,
      //   type: 'image/jpeg',
      //   name: 'avatar.jpg',
      // } as any);
      // const response = await apiClient.post('/user/avatar', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });
      // const avatarUrl = response.data.avatarUrl;

      // Временно сохраняем локально до получения API
      await AsyncStorage.setItem(STORAGE_KEYS.USER_AVATAR_URL, imageUri);
      
      // Обновляем store
      setStoredAvatarUrl(imageUri);

      Alert.alert('Успешно', 'Аватар обновлен');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить аватар. Попробуйте позже.');
    } finally {
      setIsUploading(false);
    }
  }, [setStoredAvatarUrl]);

  return {
    isUploading,
    showImagePickerOptions,
    uploadAvatar,
  };
};

