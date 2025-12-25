import { View, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../../shared/ui/ThemedText';
import { OptimizedImage } from '../../../shared/ui/OptimizedImage';
import { ThemedCard } from '../../../shared/ui/ThemedCard';
import { useThemeStore } from '../../../entities/theme/model/themeStore';
import { RoleBadge } from './RoleBadge';
import type { UserRole } from '../../../entities/session/model/authStore';

interface ProfileHeaderProps {
  avatarUrl: string | null;
  fullName: string;
  role: UserRole;
  roleLabel: string;
  group?: string;
  onAvatarPress: () => void;
  onEditPress: () => void;
  isUploading?: boolean;
  isEditing?: boolean;
}

export const ProfileHeader = ({
  avatarUrl,
  fullName,
  role,
  roleLabel,
  group,
  onAvatarPress,
  onEditPress,
  isUploading = false,
  isEditing = false,
}: ProfileHeaderProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <ThemedCard className=" mb-4 overflow-hidden rounded-2xl">
      <View className="flex-row items-center p-4">
        {/* Круглая фотография слева */}
        <Pressable
          onPress={onAvatarPress}
          disabled={isUploading}
          className="active:opacity-80"
        >
          <View className="relative">
            <View
              className={`h-20 w-20 overflow-hidden rounded-full border ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              {avatarUrl ? (
                <OptimizedImage
                  uri={avatarUrl}
                  style={{ width: 80, height: 80 }}
                  resizeMode="cover"
                  fallbackIcon="person"
                  showLoadingIndicator={false}
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Ionicons
                    name="person"
                    size={40}
                    color={isDark ? '#4B5563' : '#9CA3AF'}
                  />
                </View>
              )}
            </View>
            
            {/* Индикатор загрузки */}
            {isUploading && (
              <View className="absolute inset-0 items-center justify-center rounded-full bg-black/50">
                <ActivityIndicator color="#FFFFFF" size="small" />
              </View>
            )}
          </View>
        </Pressable>

        {/* Информация справа */}
        <View className="ml-4 flex-1">
          {/* Имя - крупным темно-серым шрифтом */}
          <View className="flex-row items-center justify-between">
            <ThemedText
              variant="title"
              className="flex-1 text-lg font-medium"
              numberOfLines={1}
              style={{ color: isDark ? '#E5E7EB' : '#111827' }}
            >
              {fullName}
            </ThemedText>
            
            {/* Кнопка редактирования */}
            <Pressable
              onPress={onEditPress}
              className="active:opacity-70"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isEditing ? 'close-outline' : 'settings-outline'}
                size={20}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
            </Pressable>
          </View>

          {/* Роль/Профессия - меньшим светлым серым шрифтом */}
          <View className="mt-1 flex-row items-center gap-2">
            <ThemedText
              variant="muted"
              className="text-sm"
              style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
            >
              {roleLabel}
              {group && ` • ${group}`}
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedCard>
  );
};
