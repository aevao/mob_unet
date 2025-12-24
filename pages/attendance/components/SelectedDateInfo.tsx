import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../../shared/ui/ThemedCard';
import { ThemedText } from '../../../shared/ui/ThemedText';
import { OptimizedImage } from '../../../shared/ui/OptimizedImage';
import { useThemeStore } from '../../../entities/theme/model/themeStore';
import type { TabelRecord } from '../../../entities/attendance/model/types';

interface SelectedDateInfoProps {
  selectedDate: string;
  selectedDateRecords: TabelRecord[];
}

export const SelectedDateInfo = ({ selectedDate, selectedDateRecords }: SelectedDateInfoProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <ThemedCard className="mb-4 p-4">
      <ThemedText variant="title" className="mb-2 text-lg font-semibold">
        {new Date(selectedDate).toLocaleDateString('ru-RU', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </ThemedText>

      {selectedDateRecords.length > 0 ? (
        <View className="mt-2">
          {selectedDateRecords.map((record) => (
            <View
              key={record.id}
              className="mb-3 rounded-lg border p-3"
              style={{
                borderColor: isDark ? '#374151' : '#E5E7EB',
                backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
              }}
            >
              <View className="mb-2 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons
                    name={record.status_info === 'Завершен' ? 'checkmark-circle' : 'time'}
                    size={20}
                    color={
                      record.status_info === 'Завершен'
                        ? isDark
                          ? '#10B981'
                          : '#059669'
                        : isDark
                          ? '#F59E0B'
                          : '#D97706'
                    }
                  />
                  <ThemedText
                    variant="body"
                    className={`ml-2 text-sm font-medium ${
                      record.status_info === 'Завершен' ? 'text-green-500' : 'text-amber-500'
                    }`}
                  >
                    {record.status_info}
                  </ThemedText>
                </View>
                <ThemedText variant="muted" className="text-xs">
                  {record.time}
                </ThemedText>
              </View>

              {record.working_time && (
                <View className="mb-2">
                  <ThemedText variant="muted" className="text-xs">
                    Время работы: {record.working_time}
                  </ThemedText>
                </View>
              )}

              {record.image_end && (
                <View className="mt-2">
                  <OptimizedImage
                    uri={record.image_end}
                    className="h-32 w-full rounded-lg"
                    resizeMode="cover"
                    showLoadingIndicator={false}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View className="mt-2">
          <View className="flex-row items-center">
            <Ionicons name="close-circle" size={20} color={isDark ? '#EF4444' : '#DC2626'} />
            <ThemedText variant="body" className="ml-2 text-sm font-medium text-red-500">
              Не отмечено
            </ThemedText>
          </View>
        </View>
      )}
    </ThemedCard>
  );
};

