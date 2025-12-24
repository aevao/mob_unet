import { View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../../shared/ui/ThemedCard';
import { ThemedText } from '../../../shared/ui/ThemedText';
import { useThemeStore } from '../../../entities/theme/model/themeStore';
import type { TabelRecord } from '../../../entities/attendance/model/types';

interface TabelHistoryProps {
  tabelRecords: TabelRecord[];
}

export const TabelHistory = ({ tabelRecords }: TabelHistoryProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (tabelRecords.length === 0) {
    return null;
  }

  return (
    <ThemedCard className="mb-4 p-4">
      <ThemedText variant="title" className="mb-3 text-lg font-semibold">
        История отметок
      </ThemedText>
      <ScrollView className="max-h-64" showsVerticalScrollIndicator={false}>
        {tabelRecords.map((record) => (
          <View
            key={record.id}
            className="mb-2 rounded-lg border p-3"
            style={{
              borderColor: isDark ? '#374151' : '#E5E7EB',
              backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
            }}
          >
            <View className="mb-1 flex-row items-center justify-between">
              <ThemedText variant="body" className="text-sm font-semibold">
                {record.date_day}
              </ThemedText>
              <View className="flex-row items-center">
                <Ionicons
                  name={record.status_info === 'Завершен' ? 'checkmark-circle' : 'time'}
                  size={16}
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
                  className={`ml-1 text-xs ${
                    record.status_info === 'Завершен' ? 'text-green-500' : 'text-amber-500'
                  }`}
                >
                  {record.status_info}
                </ThemedText>
              </View>
            </View>
            <ThemedText variant="muted" className="text-xs">
              {record.time} • {record.auditorium}
            </ThemedText>
            {record.working_time && (
              <ThemedText variant="muted" className="mt-1 text-xs">
                Время работы: {record.working_time}
              </ThemedText>
            )}
          </View>
        ))}
      </ScrollView>
    </ThemedCard>
  );
};

