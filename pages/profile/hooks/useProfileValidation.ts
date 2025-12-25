import { useMemo } from 'react';
import type { ProfileValidationErrors } from '../../../entities/profile/types';
import {
  validateEmail,
  validatePhone,
  validateBirthDate,
  validateRequired,
  validateName,
} from '../../../shared/lib/validation';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  birthDate: string;
}

export const useProfileValidation = (formData: ProfileFormData) => {
  const errors: ProfileValidationErrors = useMemo(() => {
    const validationErrors: ProfileValidationErrors = {};

    // Валидация имени
    if (!validateRequired(formData.firstName)) {
      validationErrors.firstName = 'Имя обязательно для заполнения';
    } else if (!validateName(formData.firstName)) {
      validationErrors.firstName = 'Имя может содержать только буквы';
    }

    // Валидация фамилии
    if (!validateRequired(formData.lastName)) {
      validationErrors.lastName = 'Фамилия обязательна для заполнения';
    } else if (!validateName(formData.lastName)) {
      validationErrors.lastName = 'Фамилия может содержать только буквы';
    }

    // Валидация email
    if (!validateRequired(formData.email)) {
      validationErrors.email = 'Email обязателен для заполнения';
    } else if (!validateEmail(formData.email)) {
      validationErrors.email = 'Введите корректный email адрес';
    }

    // Валидация телефона
    if (!validateRequired(formData.phone)) {
      validationErrors.phone = 'Телефон обязателен для заполнения';
    } else if (!validatePhone(formData.phone)) {
      validationErrors.phone = 'Введите телефон в формате +996XXXXXXXXX';
    }

    // Валидация даты рождения
    if (!validateRequired(formData.birthDate)) {
      validationErrors.birthDate = 'Дата рождения обязательна для заполнения';
    } else if (!validateBirthDate(formData.birthDate)) {
      validationErrors.birthDate = 'Введите дату в формате ДД.ММ.ГГГГ (возраст не менее 16 лет)';
    }

    return validationErrors;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  return { errors, isValid };
};

