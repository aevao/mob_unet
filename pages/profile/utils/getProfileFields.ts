import type { User } from '../../../entities/session/model/authStore';
import type { StudentTicket } from '../../../entities/student/model/types';
import type { ProfileFormData } from '../hooks/useProfileEdit';
import type { ProfileValidationErrors } from '../../../entities/profile/types';

export interface ProfileFieldConfig {
  icon: 'call-outline' | 'calendar-outline' | 'mail-outline' | 'people-outline' | 'card-outline' | 'briefcase-outline' | 'business-outline';
  label: string;
  value: string;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  onChange?: (value: string) => void;
  error?: string;
  editable?: boolean;
}

/**
 * Формирует список основных полей профиля
 */
type UpdateFieldFn = (field: keyof ProfileFormData, value: string) => void;

export const getPrimaryFields = (
  formData: ProfileFormData,
  user: User | null,
  errors: ProfileValidationErrors,
  updateField: UpdateFieldFn,
): ProfileFieldConfig[] => [
  {
    icon: 'call-outline',
    label: 'Телефон',
    value: formData.phone || user?.phone || '',
    placeholder: '+996XXXXXXXXX',
    keyboardType: 'phone-pad',
    onChange: (value: string) => {
      updateField('phone', value);
    },
    error: errors.phone || undefined,
  },
  {
    icon: 'calendar-outline',
    label: 'Дата рождения',
    value: formData.birthDate || user?.birthDate || '',
    placeholder: 'ДД.ММ.ГГГГ',
    onChange: (value: string) => {
      updateField('birthDate', value);
    },
    error: errors.birthDate || undefined,
  },
];

/**
 * Формирует список вторичных полей профиля в зависимости от роли
 */
export const getSecondaryFields = (
  formData: ProfileFormData,
  user: User | null,
  ticket: StudentTicket | null,
  errors: ProfileValidationErrors,
  updateField: UpdateFieldFn,
): ProfileFieldConfig[] => {
  const fields: ProfileFieldConfig[] = [
    {
      icon: 'mail-outline',
      label: 'Email',
      value: formData.email || user?.email || '',
      placeholder: 'Введите email',
      keyboardType: 'email-address',
      onChange: (value: string) => {
        updateField('email', value);
      },
      error: errors.email || undefined,
    },
  ];

  // Поля для студентов
  if (user?.role === 'student') {
    fields.push({
      icon: 'people-outline',
      label: 'Группа',
      value: formData.group || ticket?.group || '',
      placeholder: 'Введите группу',
      onChange: (value: string) => {
        updateField('group', value);
      },
    });

    if (ticket?.code_stud) {
      fields.push({
        icon: 'card-outline',
        label: 'Номер студенческого билета',
        value: ticket.code_stud,
        editable: false,
      });
    }
  }

  // Поля для сотрудников
  if (user?.role === 'employee') {
    fields.push({
      icon: 'briefcase-outline',
      label: 'Должность',
      value: formData.position || '',
      placeholder: 'Введите должность',
      onChange: (value: string) => {
        updateField('position', value);
      },
    });

    fields.push({
      icon: 'business-outline',
      label: 'Отдел',
      value: formData.department || '',
      placeholder: 'Введите отдел',
      onChange: (value: string) => {
        updateField('department', value);
      },
    });
  }

  return fields;
};

/**
 * Получает полное имя пользователя
 */
export const getUserFullName = (user: User | null): string => {
  if (!user) return '—';
  
  if (user.surname && user.firstName && user.lastName) {
    return `${user.surname} ${user.firstName} ${user.lastName}`;
  }
  
  return user.name || '—';
};

/**
 * Получает метку роли пользователя
 */
export const getUserRoleLabel = (role: string | undefined): string => {
  switch (role) {
    case 'teacher':
      return 'Преподаватель';
    case 'student':
      return 'Студент';
    case 'employee':
      return 'Сотрудник';
    default:
      return '—';
  }
};

