import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { useStudentTicketStore } from '../../entities/student/model/studentTicketStore';
import { useAuthStore } from '../../entities/session/model/authStore';
import { isSectionVisible } from '../../shared/lib/roleUtils';
import { WelcomeHeader } from '../../widgets/home/WelcomeHeader';
import { StudentTicketCard } from '../../widgets/home/StudentTicketCard';
import { EmployeeCard } from '../../widgets/home/EmployeeCard';
import { SectionsList } from '../../widgets/home/SectionsList';
import { QrCodeModal } from '../../widgets/home/QrCodeModal';

export const HomeScreen = () => {
  const [qrVisible, setQrVisible] = useState(false);
  const { ticket, error, fetchTicket } = useStudentTicketStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Загружаем данные студенческого только для студентов
    if (isSectionVisible(user?.role, ['student'])) {
      void fetchTicket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const fullName = ticket
    ? `${ticket.surname} ${ticket.first_name} ${ticket.last_name}`
    : user?.name || 'Нет данных';
  const avatarUrl = ticket?.photo || user?.avatarUrl || null;

  // Студенческий билет показываем только студентам
  const showStudentTicket = isSectionVisible(user?.role, ['student']);
  // Карточку сотрудника показываем только сотрудникам
  const showEmployeeCard = isSectionVisible(user?.role, ['employee']);

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <WelcomeHeader fullName={fullName} />

          {showStudentTicket && (
            <StudentTicketCard
              ticket={ticket}
              fullName={fullName}
              avatarUrl={avatarUrl}
              error={error}
              onSharePress={() => setQrVisible(true)}
            />
          )}

          {showEmployeeCard && <EmployeeCard user={user} />}

          <SectionsList />
        </View>
      </AppScrollView>

      {showStudentTicket && (
        <QrCodeModal visible={qrVisible} onClose={() => setQrVisible(false)} />
      )}
    </ScreenContainer>
  );
};

