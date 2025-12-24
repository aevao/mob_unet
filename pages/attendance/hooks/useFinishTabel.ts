import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { finishTabel } from '../../../entities/attendance/api/attendanceApi';
import { calculateDistance } from '../../../shared/lib/distanceUtils';

interface ActiveTabelStart {
  id: number;
  latitude: number;
  longitude: number;
  auditorium: string;
}

export const useFinishTabel = (
  activeTabelStart: ActiveTabelStart | null,
  onSuccess: () => void,
) => {
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinishTabel = useCallback(async () => {
    if (!activeTabelStart) {
      Alert.alert('Ошибка', 'Нет активной отметки для завершения');
      return;
    }

    setIsFinishing(true);

    try {
      // Получаем текущую геолокацию
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (!locationPermission.granted) {
        Alert.alert('Ошибка', 'Необходим доступ к геолокации для завершения работы');
        setIsFinishing(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const currentLat = currentLocation.coords.latitude;
      const currentLon = currentLocation.coords.longitude;

      // Проверяем расстояние (не более 20 метров)
      const distance = calculateDistance(
        activeTabelStart.latitude,
        activeTabelStart.longitude,
        currentLat,
        currentLon,
      );

      if (distance > 20) {
        Alert.alert(
          'Ошибка',
          `Вы находитесь слишком далеко от места начала работы (${Math.round(distance)}м). Для завершения необходимо находиться в пределах 20 метров от места начала.`,
        );
        setIsFinishing(false);
        return;
      }

      // Делаем второе фото (фронтальная камера для фото себя)
      const imagePermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!imagePermission.granted) {
        Alert.alert('Ошибка', 'Необходим доступ к камере для фото');
        setIsFinishing(false);
        return;
      }

      let photo;
      try {
        photo = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.7,
          base64: false,
          cameraType: ImagePicker.CameraType.front,
        });
      } catch (photoError: any) {
        console.error('Error launching camera:', photoError);
        Alert.alert('Ошибка', 'Не удалось открыть камеру. Попробуйте снова.');
        setIsFinishing(false);
        return;
      }

      if (photo.canceled) {
        Alert.alert('Отменено', 'Фото не было сделано');
        setIsFinishing(false);
        return;
      }

      if (!photo.assets || photo.assets.length === 0) {
        Alert.alert('Ошибка', 'Не удалось получить фото');
        setIsFinishing(false);
        return;
      }

      const photoAsset = photo.assets[0];
      
      if (!photoAsset.uri) {
        Alert.alert('Ошибка', 'Фото не содержит данных');
        setIsFinishing(false);
        return;
      }

      // Формируем FormData для завершения
      const formData = new FormData();
      formData.append('auditorium', activeTabelStart.auditorium);
      
      const geoloc_info = `${currentLat}, ${currentLon}`;
      formData.append('geo', geoloc_info);
      
      let photoUri = photoAsset.uri;
      if (!photoUri.startsWith('file://') && !photoUri.startsWith('http://') && !photoUri.startsWith('https://')) {
        photoUri = `file://${photoUri}`;
      }
      
      const imageFile = {
        uri: photoUri,
        type: 'image/jpeg',
        name: `tabel_end_${Date.now()}.jpg`,
      };
      
      formData.append('image', imageFile as any);

      await finishTabel(formData);
      await onSuccess();

      Alert.alert('Успешно', 'Работа завершена!');
    } catch (error: any) {
      console.error('Error finishing tabel:', error);
      Alert.alert(
        'Ошибка',
        error.response?.data?.message || error.message || 'Не удалось завершить работу. Попробуйте снова.',
      );
    } finally {
      setIsFinishing(false);
    }
  }, [activeTabelStart, onSuccess]);

  return {
    isFinishing,
    handleFinishTabel,
  };
};

