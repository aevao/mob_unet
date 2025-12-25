import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

interface UseAvatarUploadProps {
  onUpload?: (uri: string) => Promise<string | void>;
}

export const useAvatarUpload = ({ onUpload }: UseAvatarUploadProps = {}) => {
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

  const showImagePickerOptions = useCallback(async () => {
    return new Promise<string | null>((resolve) => {
      Alert.alert(
        'Выберите фото',
        'Откуда вы хотите загрузить фото?',
        [
          { text: 'Отмена', style: 'cancel', onPress: () => resolve(null) },
          {
            text: 'Камера',
            onPress: async () => {
              const uri = await takePhoto();
              if (uri) {
                await uploadAvatar(uri);
                resolve(uri);
              } else {
                resolve(null);
              }
            },
          },
          {
            text: 'Галерея',
            onPress: async () => {
              const uri = await pickImage();
              if (uri) {
                await uploadAvatar(uri);
                resolve(uri);
              } else {
                resolve(null);
              }
            },
          },
        ]
      );
    });
  }, [pickImage, takePhoto, uploadAvatar]);

  const uploadAvatar = useCallback(async (imageUri: string) => {
    try {
      setIsUploading(true);

      if (onUpload) {
        await onUpload(imageUri);
      } else {
        // Fallback: просто показываем сообщение
        Alert.alert('Успешно', 'Аватар выбран');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      // Ошибка уже обработана в onUpload
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  return {
    isUploading,
    showImagePickerOptions,
    uploadAvatar,
  };
};

