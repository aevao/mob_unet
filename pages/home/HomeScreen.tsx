import { useEffect } from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { useStudentTicketStore } from '../../entities/student/model/studentTicketStore';
import { useAuthStore } from '../../entities/session/model/authStore';
import { isSectionVisible } from '../../shared/lib/roleUtils';
import { SectionsGrid } from '../../widgets/home/SectionsGrid';
import { TodayScheduleWidget } from '../../widgets/home/TodayScheduleWidget';
import { NotificationsWidget } from '../../widgets/home/NotificationsWidget';
import { AttendanceWidget } from '../../widgets/home/AttendanceWidget';
import { useScheduleStore } from '../../entities/schedule/model/scheduleStore';

export const HomeScreen = () => {
  const { fetchTicket } = useStudentTicketStore();
  const { user } = useAuthStore();
  const { fetchSchedule } = useScheduleStore();

  useEffect(() => {
    // Загружаем данные студенческого только для студентов
    if (isSectionVisible(user?.role, ['student'])) {
      void fetchTicket();
    }
    // Загружаем расписание для всех
    void fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  return (
    <ScreenContainer>
      <AppScrollView showsVerticalScrollIndicator={false}>
        <View className="">
          {isSectionVisible(user?.role, ['student', 'all']) && <TodayScheduleWidget />}

          {/* Sections Grid */}
          <SectionsGrid />
          {/* Widgets */}
          <NotificationsWidget />
          <AttendanceWidget />
        </View>
      </AppScrollView>
    </ScreenContainer>
  );
};

