import { UserRole } from '../../entities/session/model/authStore';

/**
 * Типы ролей для управления видимостью разделов
 */
export type RoleType = 'student' | 'employee' | 'teacher' | 'all';

/**
 * Проверяет, должна ли секция быть видима для текущей роли пользователя
 * @param userRole - Роль пользователя
 * @param allowedRoles - Массив разрешенных ролей для этой секции
 * @returns true если секция должна быть видима
 */
export const isSectionVisible = (
  userRole: UserRole | null | undefined,
  allowedRoles: RoleType[],
): boolean => {
  if (!userRole) return false;

  // Если 'all' в списке разрешенных ролей - показываем всем
  if (allowedRoles.includes('all')) return true;

  // Проверяем, есть ли роль пользователя в списке разрешенных
  return allowedRoles.includes(userRole);
};

/**
 * Хук для удобной проверки видимости секций
 * Использование:
 * import { useRoleVisibility } from '../../shared/lib/roleUtils';
 * const { isStudent, isEmployee, isVisible } = useRoleVisibility();
 * 
 * Или для проверки конкретных ролей:
 * const isVisible = useRoleVisibility(['student', 'employee']);
 * 
 * Примечание: Этот хук должен использоваться внутри React компонентов.
 * Для использования вне компонентов используйте isSectionVisible напрямую.
 */
export const useRoleVisibility = (allowedRoles?: RoleType[]) => {
  // Динамический импорт для избежания циклических зависимостей
  const { useAuthStore } = require('../../entities/session/model/authStore');
  const { user } = useAuthStore();
  const userRole = user?.role;

  const isStudent = userRole === 'student';
  const isEmployee = userRole === 'employee';
  const isTeacher = userRole === 'teacher';

  const isVisible = allowedRoles
    ? isSectionVisible(userRole, allowedRoles)
    : true;

  return {
    isStudent,
    isEmployee,
    isTeacher,
    userRole,
    isVisible,
  };
};

