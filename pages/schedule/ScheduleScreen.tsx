import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { DaySelector } from '../../widgets/schedule/DaySelector';
import { ScheduleCard } from '../../widgets/schedule/ScheduleCard';
import { ScheduleSkeleton } from '../../widgets/schedule/ScheduleSkeleton';
import { useScheduleStore } from '../../entities/schedule/model/scheduleStore';
import { DAY_LABELS, type DayOfWeek } from '../../entities/schedule/model/types';

// Функция для определения текущего дня недели
const getCurrentDayOfWeek = (): DayOfWeek => {
  const today = new Date().getDay(); // 0 = воскресенье, 1 = понедельник, ..., 6 = суббота
  
  // Преобразуем в формат, где понедельник = 0
  // Если воскресенье (0), выбираем понедельник
  const dayIndex = today === 0 ? 0 : today - 1;
  
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[dayIndex] || 'monday'; // fallback на понедельник
};

export const ScheduleScreen = () => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getCurrentDayOfWeek());
  const { schedule, isLoading, error, fetchSchedule } = useScheduleStore();

  useEffect(() => {
    void fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentDaySchedule = schedule?.[selectedDay] || [];

  const handleSelectItem = (item: any) => {
 
  };

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-4 px-2">
          <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />

          {isLoading ? (
            <ScheduleSkeleton />
          ) : error ? (
            <View className="py-8">
              <ThemedText variant="muted" className="text-center text-red-400">
                {error}
              </ThemedText>
            </View>
          ) : (
            <ScheduleCard
              title={DAY_LABELS[selectedDay]}
              data={currentDaySchedule}
              onSelect={handleSelectItem}
            />
          )}
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};


