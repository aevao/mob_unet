import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { useStudentTicketStore } from '../../entities/student/model/studentTicketStore';
import { useAuthStore } from '../../entities/session/model/authStore';
import { WelcomeHeader } from '../../widgets/home/WelcomeHeader';
import { StudentTicketCard } from '../../widgets/home/StudentTicketCard';
import { SectionsList } from '../../widgets/home/SectionsList';
import { QrCodeModal } from '../../widgets/home/QrCodeModal';

export const HomeScreen = () => {
  const [qrVisible, setQrVisible] = useState(false);
  const { ticket, error, fetchTicket } = useStudentTicketStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Загружаем данные студенческого один раз при монтировании экрана
    void fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fullName = ticket
    ? `${ticket.surname} ${ticket.first_name} ${ticket.last_name}`
    : user?.name || 'Нет данных';
  const avatarUrl = ticket?.photo || user?.avatarUrl || null;

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <WelcomeHeader fullName={fullName} />

          <StudentTicketCard
            ticket={ticket}
            fullName={fullName}
            avatarUrl={avatarUrl}
            error={error}
            onSharePress={() => setQrVisible(true)}
          />

          <SectionsList />
        </View>
      </AppScrollView>

      <QrCodeModal visible={qrVisible} onClose={() => setQrVisible(false)} />
    </ScreenContainer>
  );
};

