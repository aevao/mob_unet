/**
 * Валидация email адреса
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Валидация телефона в формате +996
 */
export const validatePhone = (phone: string): boolean => {
  // Убираем все пробелы и дефисы
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Проверяем формат +996XXXXXXXXX (12 цифр после +996)
  const phoneRegex = /^\+996\d{9}$/;
  
  // Также поддерживаем формат без +996 (9 цифр)
  const localPhoneRegex = /^\d{9}$/;
  
  return phoneRegex.test(cleaned) || localPhoneRegex.test(cleaned);
};

/**
 * Форматирование телефона в формат +996
 */
export const formatPhone = (phone: string): string => {
  // Убираем все нецифровые символы кроме +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Если уже начинается с +996, возвращаем как есть
  if (cleaned.startsWith('+996')) {
    return cleaned;
  }
  
  // Если начинается с 996, добавляем +
  if (cleaned.startsWith('996')) {
    return `+${cleaned}`;
  }
  
  // Если 9 цифр, добавляем +996
  if (/^\d{9}$/.test(cleaned)) {
    return `+996${cleaned}`;
  }
  
  // Если меньше 9 цифр, возвращаем как есть (пользователь еще вводит)
  if (cleaned.length < 9) {
    return cleaned;
  }
  
  // В остальных случаях добавляем +996
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length >= 9) {
    return `+996${digits.slice(-9)}`;
  }
  
  return cleaned;
};

/**
 * Валидация даты рождения
 */
export const validateBirthDate = (date: string): boolean => {
  if (!date) return false;
  
  // Формат ДД.ММ.ГГГГ
  const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const match = date.match(dateRegex);
  
  if (!match) return false;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  // Проверяем диапазоны
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  
  // Проверяем валидность даты
  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return false;
  }
  
  // Проверяем, что дата не в будущем
  if (dateObj > new Date()) return false;
  
  // Проверяем, что возраст не менее 16 лет
  const age = new Date().getFullYear() - year;
  if (age < 16) return false;
  
  return true;
};

/**
 * Форматирование даты в формат ДД.ММ.ГГГГ
 */
export const formatBirthDate = (date: string): string => {
  if (!date) return '';
  
  // Если уже в формате ДД.ММ.ГГГГ, возвращаем как есть
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
    return date;
  }
  
  // Пытаемся распарсить ISO формат или другие форматы
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return date; // Возвращаем как есть, если не удалось распарсить
  }
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}.${month}.${year}`;
};

/**
 * Валидация обязательных полей
 */
export const validateRequired = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim().length > 0;
};

/**
 * Валидация имени (только буквы, пробелы, дефисы)
 */
export const validateName = (name: string): boolean => {
  if (!name || name.trim().length === 0) return false;
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
  return nameRegex.test(name);
};

