import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '../../../entities/session/model/authStore';
import { useStudentTicketStore } from '../../../entities/student/model/studentTicketStore';
import { updateProfile, uploadAvatar } from '../../../entities/profile/api/profileApi';
import { useProfileValidation } from './useProfileValidation';
import { formatPhone, formatBirthDate } from '../../../shared/lib/validation';
import type { UpdateProfileRequest } from '../../../entities/profile/types';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  birthDate: string;
  // Student fields
  group?: string;
  major?: string;
  educationForm?: 'full-time' | 'part-time';
  // Employee fields
  position?: string;
  department?: string;
}

export const useProfileEdit = () => {
  const { user } = useAuthStore();
  const { ticket } = useStudentTicketStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    middleName: user?.surname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate ? formatBirthDate(user.birthDate) : '',
    group: ticket?.group || '',
    educationForm: 'full-time',
  });

  // Обновляем форму при изменении user или ticket
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        middleName: user.surname || prev.middleName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        birthDate: user.birthDate ? formatBirthDate(user.birthDate) : prev.birthDate,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (ticket?.group) {
      setFormData((prev) => ({
        ...prev,
        group: ticket.group || prev.group,
      }));
    }
  }, [ticket]);

  const { errors, isValid } = useProfileValidation({
    firstName: formData.firstName,
    lastName: formData.lastName,
    middleName: formData.middleName,
    email: formData.email,
    phone: formData.phone,
    birthDate: formData.birthDate,
  });

  const startEditing = useCallback(() => {
    setIsEditing(true);
    // Сбрасываем форму к исходным данным
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      middleName: user?.surname || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate ? formatBirthDate(user.birthDate) : '',
      group: ticket?.group || '',
      educationForm: 'full-time',
    });
  }, [user, ticket]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    // Восстанавливаем исходные данные
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      middleName: user?.surname || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate ? formatBirthDate(user.birthDate) : '',
      group: ticket?.group || '',
      educationForm: 'full-time',
    });
  }, [user, ticket]);

  const updateField = useCallback((field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => {
      // Автоформатирование телефона
      if (field === 'phone') {
        return { ...prev, [field]: formatPhone(value) };
      }
      return { ...prev, [field]: value };
    });
  }, []);

  const saveProfile = useCallback(async () => {
    // Проверяем валидность
    if (!isValid) {
      const firstError = Object.values(errors)[0];
      Alert.alert('Ошибка валидации', firstError || 'Проверьте введенные данные');
      return;
    }

    try {
      setIsSaving(true);

      const updateData: UpdateProfileRequest = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        middleName: formData.middleName?.trim(),
        email: formData.email.trim(),
        phone: formatPhone(formData.phone),
        birthDate: formData.birthDate,
      };

      // Добавляем поля в зависимости от роли
      if (user?.role === 'student') {
        updateData.group = formData.group?.trim();
        updateData.educationForm = formData.educationForm;
      } else if (user?.role === 'employee') {
        updateData.position = formData.position?.trim();
        updateData.department = formData.department?.trim();
      }

      await updateProfile(updateData);

      setIsEditing(false);
      Alert.alert('Успешно', 'Данные профиля обновлены');
      
      // TODO: Обновить данные пользователя в store
      // Можно добавить метод refreshUser в authStore
    } catch (error: any) {
      console.error('Error saving profile:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'Не удалось сохранить данные. Попробуйте позже.';
      Alert.alert('Ошибка', errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [formData, isValid, errors, user]);

  const saveAvatar = useCallback(async (avatarUri: string) => {
    try {
      setIsSaving(true);
      const response = await uploadAvatar(avatarUri);
      
      // TODO: Обновить avatarUrl в store
      Alert.alert('Успешно', 'Аватар обновлен');
      return response.avatarUrl;
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      const errorMessage =
        error?.response?.data?.message ||
        'Не удалось загрузить аватар. Попробуйте позже.';
      Alert.alert('Ошибка', errorMessage);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    isEditing,
    isSaving,
    formData,
    errors,
    isValid,
    startEditing,
    cancelEditing,
    updateField,
    saveProfile,
    saveAvatar,
  };
};
