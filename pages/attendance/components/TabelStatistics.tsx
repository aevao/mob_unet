import { View } from 'react-native';
import { ThemedCard } from '../../../shared/ui/ThemedCard';
import { ThemedText } from '../../../shared/ui/ThemedText';
import type { TabelRecord } from '../../../entities/attendance/model/types';

interface TabelStatisticsProps {
  tabelRecords: TabelRecord[];
}

export const TabelStatistics = ({ tabelRecords }: TabelStatisticsProps) => {
  const completedCount = tabelRecords.filter((r) => r.status_info === 'Завершен').length;
  const inProgressCount = tabelRecords.filter((r) => r.status_info === 'Начат').length;

  return (
    <ThemedCard className="p-4">
      <ThemedText variant="title" className="mb-3 text-lg font-semibold">
        Статистика
      </ThemedText>
      <View className="mb-2 flex-row items-center justify-between">
        <ThemedText variant="body" className="text-base">
          Всего отметок:
        </ThemedText>
        <ThemedText variant="body" className="text-base font-bold">
          {tabelRecords.length}
        </ThemedText>
      </View>
      <View className="flex-row items-center justify-between">
        <ThemedText variant="body" className="text-base">
          Завершено:
        </ThemedText>
        <ThemedText variant="body" className="text-base font-bold text-green-500">
          {completedCount}
        </ThemedText>
      </View>
      <View className="mt-2 flex-row items-center justify-between">
        <ThemedText variant="body" className="text-base">
          В процессе:
        </ThemedText>
        <ThemedText variant="body" className="text-base font-bold text-amber-500">
          {inProgressCount}
        </ThemedText>
      </View>
    </ThemedCard>
  );
};

