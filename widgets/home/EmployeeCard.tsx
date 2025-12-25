import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { useAuthStore } from '../../entities/session/model/authStore';
import type { User } from '../../entities/session/model/authStore';
import { OptimizedImage } from '../../shared/ui/OptimizedImage';
import { getUserAvatarSync } from '../../shared/lib/getUserAvatar';

interface EmployeeCardProps {
  user: User | null;
}

export const EmployeeCard = ({ user }: EmployeeCardProps) => {
  const { theme } = useThemeStore();
  const { storedAvatarUrl } = useAuthStore();
  const navigation = useNavigation();
  const isDark = theme === 'dark';

  const fullName = user?.surname && user?.firstName && user?.lastName
    ? `${user.surname} ${user.firstName} ${user.lastName}`
    : user?.name || 'Нет данных';

  const avatarUrl = getUserAvatarSync(user?.avatarUrl, null, storedAvatarUrl);
  
  const rawData = user?.raw as any;
  const division = rawData?.division || null;
  const position = rawData?.position || null;

  const handlePress = () => {
    try {
      const parent = navigation.getParent();
      if (parent) {
        (parent as any).navigate('HomeTab', { screen: 'EmployeeCard' });
      } else {
        (navigation as any).navigate('EmployeeCard');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <Pressable onPress={handlePress} className="active:opacity-95">
      <ThemedCard className="mb-4 overflow-hidden rounded-2xl">
        {/* Верхняя часть с градиентом */}
        <View
          className="px-4 pt-5 pb-4"
          style={{
            backgroundColor: isDark ? 'rgba(30, 58, 138, 0.3)' : '#EFF6FF',
          }}
        >
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className={`h-10 w-10 items-center justify-center rounded-xl ${
                  isDark ? 'bg-blue-800/50' : 'bg-white'
                }`}
              >
                <Ionicons
                  name="briefcase"
                  size={20}
                  color={isDark ? '#60A5FA' : '#2563EB'}
                />
              </View>
              <ThemedText variant="title" className="ml-3 text-lg font-bold">
                Карточка сотрудника
              </ThemedText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>

          <View className="flex-row">
            <View
              className="overflow-hidden rounded-xl"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <OptimizedImage
                uri={avatarUrl}
                style={{ width: 70, height: 90 }}
                resizeMode="cover"
                fallbackIcon="person"
                showLoadingIndicator={false}
              />
            </View>

            <View className="ml-4 flex-1 justify-center">
              <ThemedText
                variant="title"
                className="text-base font-bold"
                numberOfLines={2}
                style={{ color: isDark ? '#FFFFFF' : '#111827' }}
              >
                {fullName}
              </ThemedText>
              {position && (
                <View className="mt-2 flex-row items-center">
                  <Ionicons
                    name="person-circle-outline"
                    size={14}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                  <ThemedText
                    variant="body"
                    className="ml-2 text-xs"
                    numberOfLines={1}
                    style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}
                  >
                    {position}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Нижняя часть с краткой информацией */}
        {(division || position) && (
          <View className="px-4 pb-4">
            {division && (
              <View className="mt-3 flex-row items-center">
                <Ionicons
                  name="business-outline"
                  size={16}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
                <ThemedText
                  variant="body"
                  className="ml-2 flex-1 text-xs"
                  numberOfLines={1}
                  style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                >
                  {division}
                </ThemedText>
              </View>
            )}
          </View>
        )}
      </ThemedCard>
    </Pressable>
  );
};
