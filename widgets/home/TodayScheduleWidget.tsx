import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useScheduleStore } from '../../entities/schedule/model/scheduleStore';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import type { ScheduleStackParamList } from '../../app/navigation/types';

type ScheduleNavigationProp = NativeStackNavigationProp<ScheduleStackParamList>;

// Функция для определения текущего дня недели
const getCurrentDayOfWeek = (): string => {
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 0 : today - 1;
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[dayIndex] || 'monday';
};

const DAY_LABELS: Record<string, string> = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
};

export const TodayScheduleWidget = () => {
  const navigation = useNavigation<ScheduleNavigationProp>();
  const { schedule } = useScheduleStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const currentDay = getCurrentDayOfWeek();
  const todaySchedule = schedule?.[currentDay] || [];
  const nextClasses = todaySchedule.slice(0, 2); // Показываем только 2 ближайших занятия

  const handlePress = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('ScheduleTab');
    }
  };

  if (todaySchedule.length === 0) {
    return null;
  }

  return (
    <Pressable onPress={handlePress} className="mb-4">
      <ThemedCard className="p-4">
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className={`h-10 w-10 items-center justify-center rounded-xl ${
                isDark ? 'bg-blue-900/30' : 'bg-blue-50'
              }`}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={isDark ? '#60A5FA' : '#2563EB'}
              />
            </View>
            <ThemedText variant="title" className="ml-3 text-lg font-bold">
              Расписание на сегодня
            </ThemedText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? '#9CA3AF' : '#6B7280'}
          />
        </View>

        {nextClasses.map((item, index) => (
          <View key={index} className="mb-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <ThemedText variant="body" className="text-sm font-semibold">
                  {item.subject || item.name || 'Занятие'}
                </ThemedText>
                <ThemedText variant="muted" className="mt-1 text-xs">
                  {item.time || item.startTime || ''} • {item.auditorium || item.room || ''}
                </ThemedText>
              </View>
            </View>
          </View>
        ))}

        {todaySchedule.length > 2 && (
          <ThemedText variant="muted" className="mt-2 text-center text-xs">
            +{todaySchedule.length - 2} еще занятий
          </ThemedText>
        )}
      </ThemedCard>
    </Pressable>
  );
};

