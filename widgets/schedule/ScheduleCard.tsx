import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { formatTeacherName } from '../../shared/lib/formatTeacherName';
import type { IScheduleItem } from '../../entities/schedule/model/types';

interface ScheduleCardProps {
  title: string;
  data?: IScheduleItem[];
  onSelect?: (subject: IScheduleItem) => void;
}

const getColor = (type: string | null | undefined, isDark: boolean) => {
  switch (type) {
    case 'Пр':
      return isDark ? 'bg-emerald-600' : 'bg-emerald-500';
    case 'Лк':
      return isDark ? 'bg-blue-600' : 'bg-blue-500';
    case 'Лб':
      return isDark ? 'bg-violet-600' : 'bg-violet-500';
    default:
      return isDark ? 'bg-gray-600' : 'bg-gray-500';
  }
};

export const ScheduleCard = ({ title, data, onSelect }: ScheduleCardProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <ThemedCard className="rounded-2xl p-4">
      <ThemedText variant="title" className="mb-4 text-lg font-semibold">
        {title}
      </ThemedText>

      {!data ? (
        <View className="py-8">
          <ThemedText variant="muted" className="text-center">
            Загрузка...
          </ThemedText>
        </View>
      ) : data.length === 0 ? (
        <ThemedText variant="muted" className="py-6 text-center">
          Нет занятий
        </ThemedText>
      ) : (
        <View className="flex-col gap-3">
          {data.map((item, index) => {
            const isFree = item.subject === null;
            const color = getColor(item.class_type, isDark);

            return (
              <Pressable
                key={`${item.time}-${item.auditorium || 'free'}-${index}`}
                onPress={() => !isFree && onSelect?.(item)}
                disabled={isFree}
                className={`flex-row items-start rounded-xl p-3 ${
                  isFree
                    ? isDark
                      ? 'border border-gray-700'
                      : 'border border-gray-200'
                    : isDark
                      ? 'border border-gray-700 active:bg-gray-800/50'
                      : 'border border-gray-200 active:bg-blue-50'
                }`}
              >
                {!isFree && (
                  <View className={`mr-3 rounded-md p-2 ${color}`}>
                    <Ionicons name="book-outline" size={18} color="#FFFFFF" />
                  </View>
                )}

                <View className="flex-1 flex-col gap-1">
                  {isFree ? (
                    <ThemedText variant="body" className="text-sm">
                      {item.time}
                    </ThemedText>
                  ) : (
                    <View>
                      <View className="mb-1 flex-row items-center justify-between flex-wrap gap-2">
                        <View className={`rounded px-2 py-0.5 ${color}`}>
                          <ThemedText variant="body" className="text-[10px] text-white font-semibold">
                            {item.class_type || '—'}
                          </ThemedText>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color={isDark ? '#9CA3AF' : '#6B7280'}
                          />
                          <ThemedText variant="muted" className="text-xs">
                            {item.time}
                          </ThemedText>
                        </View>
                        {item.auditorium && (
                          <View className="flex-row items-center gap-1">
                            <Ionicons
                              name="location-outline"
                              size={14}
                              color={isDark ? '#9CA3AF' : '#6B7280'}
                            />
                            <ThemedText variant="muted" className="text-xs">
                              {item.auditorium}
                            </ThemedText>
                          </View>
                        )}
                      </View>

                      <ThemedText variant="body" className="text-sm font-semibold">
                        {item.subject}
                      </ThemedText>

                      {item.teacher && (
                        <View className="flex-row items-center gap-1">
                          <Ionicons
                            name="person-outline"
                            size={14}
                            color={isDark ? '#9CA3AF' : '#6B7280'}
                          />
                          <ThemedText variant="muted" className="text-xs">
                            {formatTeacherName(item.teacher)}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </ThemedCard>
  );
};

