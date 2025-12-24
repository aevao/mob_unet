import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '../../../entities/session/model/authStore';

interface ProfileData {
  firstName: string;
  lastName: string;
  surname: string;
  email: string;
  phone: string;
  birthDate: string;
}

export const useProfileEdit = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    surname: user?.surname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
  });

  const startEditing = useCallback(() => {
    setIsEditing(true);
    // Сбрасываем форму к исходным данным
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      surname: user?.surname || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate || '',
    });
  }, [user]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    // Восстанавливаем исходные данные
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      surname: user?.surname || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate || '',
    });
  }, [user]);

  const updateField = useCallback((field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const saveProfile = useCallback(async () => {
    try {
      setIsSaving(true);
      
      // TODO: Заменить на реальный API вызов
      // await updateProfileAPI(formData);
      
      // Заглушка для демонстрации
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // После успешного сохранения обновляем данные пользователя
      // await useAuthStore.getState().refreshUser();
      
      setIsEditing(false);
      Alert.alert('Успешно', 'Данные профиля обновлены');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить данные. Попробуйте позже.');
    } finally {
      setIsSaving(false);
    }
  }, [formData]);

  return {
    isEditing,
    isSaving,
    formData,
    startEditing,
    cancelEditing,
    updateField,
    saveProfile,
  };
};

