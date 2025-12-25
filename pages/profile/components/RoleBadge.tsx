import { View } from 'react-native';
import { ThemedText } from '../../../shared/ui/ThemedText';
import { useThemeStore } from '../../../entities/theme/model/themeStore';
import type { UserRole } from '../../../entities/profile/types';

interface RoleBadgeProps {
  role: UserRole;
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const roleLabel = role === 'student' ? 'Студент' : 'Сотрудник';
  const bgColor = 'bg-white/90';
  const textColor = 'text-blue-600';

  return (
    <View
      className={`rounded-full px-3 py-1 ${bgColor}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <ThemedText variant="body" className={`text-xs font-semibold ${textColor}`}>
        {roleLabel}
      </ThemedText>
    </View>
  );
};

