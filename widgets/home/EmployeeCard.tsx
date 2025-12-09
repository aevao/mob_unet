import { Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { User } from '../../entities/session/model/authStore';

interface EmployeeCardProps {
  user: User | null;
}

export const EmployeeCard = ({ user }: EmployeeCardProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const fullName = user?.surname && user?.firstName && user?.lastName
    ? `${user.surname} ${user.firstName} ${user.lastName}`
    : user?.name || 'Нет данных';

  const avatarUrl = user?.avatarUrl || null;
  
  // Пытаемся получить division и position из raw данных
  // Если их нет в токене, можно будет добавить отдельный API запрос
  const rawData = user?.raw as any;
  const division = rawData?.division || null;
  const position = rawData?.position || null;
  
  const email = user?.email || null;
  const phone = user?.phone || null;

  return (
    <ThemedCard className="mb-4 p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View
            className={`h-10 w-10 items-center justify-center rounded-xl ${
              isDark ? 'bg-blue-900/30' : 'bg-blue-50'
            }`}
          >
            <Ionicons
              name="briefcase-outline"
              size={20}
              color={isDark ? '#60A5FA' : '#2563EB'}
            />
          </View>
          <ThemedText variant="title" className="ml-3 text-lg font-bold">
            Карточка сотрудника
          </ThemedText>
        </View>
      </View>

      <ThemedText variant="muted" className="text-xs text-center">
        Кыргызский государственный технический университет им. И. Раззакова
      </ThemedText>

      <View className="mt-4 flex-row">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="h-24 w-20 rounded-xl bg-white"
            resizeMode="cover"
          />
        ) : (
          <View
            className={`h-24 w-20 items-center justify-center rounded-xl ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <Ionicons
              name="person"
              size={32}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>
        )}

        <View className="ml-4 flex-1">
          <ThemedText variant="label" className="text-[11px] uppercase">
            ФИО:
          </ThemedText>
          <ThemedText variant="body" className="text-sm font-semibold">
            {fullName}
          </ThemedText>

          {division && (
            <>
              <ThemedText variant="label" className="mt-2 text-[11px] uppercase">
                Подразделение:
              </ThemedText>
              <ThemedText variant="body" className="text-sm">
                {division}
              </ThemedText>
            </>
          )}

          {position && (
            <>
              <ThemedText variant="label" className="mt-2 text-[11px] uppercase">
                Должность:
              </ThemedText>
              <ThemedText variant="body" className="text-sm">
                {position}
              </ThemedText>
            </>
          )}

          {email && (
            <>
              <ThemedText variant="label" className="mt-2 text-[11px] uppercase">
                Email:
              </ThemedText>
              <ThemedText variant="body" className="text-sm">
                {email}
              </ThemedText>
            </>
          )}

          {phone && (
            <>
              <ThemedText variant="label" className="mt-2 text-[11px] uppercase">
                Телефон:
              </ThemedText>
              <ThemedText variant="body" className="text-sm">
                {phone}
              </ThemedText>
            </>
          )}
        </View>
      </View>
    </ThemedCard>
  );
};

