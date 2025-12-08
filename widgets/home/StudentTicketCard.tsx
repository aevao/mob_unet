import { Image, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { StudentTicket } from '../../entities/student/model/studentTicketStore';

interface StudentTicketCardProps {
  ticket: StudentTicket | null;
  fullName: string;
  avatarUrl: string | null;
  error: string | null;
  onSharePress: () => void;
}

export const StudentTicketCard = ({
  ticket,
  fullName,
  avatarUrl,
  error,
  onSharePress,
}: StudentTicketCardProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

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
              name="card-outline"
              size={20}
              color={isDark ? '#60A5FA' : '#2563EB'}
            />
          </View>
          <ThemedText variant="title" className="ml-3 text-lg font-bold">
            Студенческий билет
          </ThemedText>
          
        </View>
        <View className="items-end">
        <Pressable
          onPress={onSharePress}
          className={`h-10 w-10 items-center justify-center rounded-full ${
            isDark ? 'bg-blue-900/30' : 'bg-blue-50'
          }`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? '#60A5FA' : '#2563EB'}
          />
        </Pressable>
      </View>
      </View>

      <ThemedText variant="muted" className="text-xs text-center">
        Кыргызский государственный технический университет им. И. Раззакова
      </ThemedText>
      <ThemedText variant="body" className="mt-2 text-center text-xs">
        Студенческий билет {ticket?.code_stud ?? ''}
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
            Фамилия, фамилиясы:
          </ThemedText>
          <ThemedText variant="body" className="text-sm font-semibold">
            {fullName}
          </ThemedText>

          <ThemedText variant="label" className="mt-2 text-[11px] uppercase">
            Группа:
          </ThemedText>
          <ThemedText variant="body" className="text-sm">
            {ticket?.group || 'Нет данных'}
          </ThemedText>

          <ThemedText variant="label" className="mt-2 text-[11px] uppercase">
            Курс:
          </ThemedText>
          <ThemedText variant="body" className="text-sm">
            {ticket?.cource || 'Нет данных'}
          </ThemedText>

          <ThemedText variant="label" className="mt-2 text-[11px] uppercase">
            Год обучения, окуган жылы:
          </ThemedText>
          <ThemedText variant="body" className="text-sm">
            {ticket?.year_study || 'Нет данных'}
          </ThemedText>
        </View>
      </View>

      {error ? (
        <ThemedText variant="muted" className="mt-3 text-xs text-red-400">
          {error}
        </ThemedText>
      ) : null}

      
    </ThemedCard>
  );
};

