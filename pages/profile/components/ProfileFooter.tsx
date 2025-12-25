import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../../shared/ui/ThemedText';
import { ThemedCard } from '../../../shared/ui/ThemedCard';
import { useThemeStore } from '../../../entities/theme/model/themeStore';

interface ProfileFooterProps {
  fullName: string;
  onLogout: () => void;
}

export const ProfileFooter = ({ fullName, onLogout }: ProfileFooterProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <ThemedCard className="mb-6 overflow-hidden rounded-2xl">


      {/* Кнопка выхода */}
      <Pressable onPress={onLogout} className="active:opacity-70">
        <View className="flex-row items-center px-4 py-4">
          <Ionicons
            name="log-out-outline"
            size={20}
            color={isDark ? '#9CA3AF' : '#6B7280'}
            style={{ width: 24, marginRight: 12 }}
          />
          <ThemedText
            variant="body"
            className="flex-1 text-base font-medium"
            style={{ color: isDark ? '#E5E7EB' : '#111827' }}
          >
            Выйти из аккаунта
          </ThemedText>
        </View>
      </Pressable>
    </ThemedCard>
  );
};

