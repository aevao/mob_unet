import { useState } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import { DateData } from 'react-native-calendars';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { QRScannerModal } from '../../widgets/attendance/QRScannerModal';
import { useTabelData } from './hooks/useTabelData';
import { useFinishTabel } from './hooks/useFinishTabel';
import { TabelCalendar } from './components/TabelCalendar';
import { TabelActionButton } from './components/TabelActionButton';
import { SelectedDateInfo } from './components/SelectedDateInfo';
import { TabelHistory } from './components/TabelHistory';
import { TabelStatistics } from './components/TabelStatistics';
import { buildMarkedDates } from './utils/tabelUtils';
import { convertDateToISO } from './utils/dateUtils';

export const TabScreen = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [showQRScanner, setShowQRScanner] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );

  const {
    tabelRecords,
    isLoading,
    isRefreshing,
    activeTabelStart,
    lastTabelRecord,
    loadTabel,
    onRefresh,
  } = useTabelData();

  const { isFinishing, handleFinishTabel } = useFinishTabel(activeTabelStart, loadTabel);

  const handleQRSuccess = () => {
    loadTabel();
  };

  const markedDates = buildMarkedDates(tabelRecords, selectedDate, isDark);

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const selectedDateRecords = tabelRecords.filter(
    (record) => convertDateToISO(record.date_day) === selectedDate,
  );

  const isTodayCompleted = lastTabelRecord?.status_info === 'Завершен';

  return (
    <ScreenContainer>
      <AppScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <View className="mb-4 p-1">
          <ThemedText variant="title" className="mb-4 text-xl font-bold">
            Табель
          </ThemedText>

          {isLoading ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator color={isDark ? '#60A5FA' : '#2563EB'} />
              <ThemedText variant="muted" className="mt-3 text-sm">
                Загружаем календарь…
              </ThemedText>
            </View>
          ) : (
            <>
              <TabelCalendar
                selectedDate={selectedDate}
                markedDates={markedDates}
                onDayPress={onDayPress}
              />

              <TabelActionButton
                isTodayCompleted={isTodayCompleted}
                hasActiveTabel={!!activeTabelStart}
                isFinishing={isFinishing}
                onMarkPress={() => setShowQRScanner(true)}
                onFinishPress={handleFinishTabel}
              />

              {selectedDate && (
                <SelectedDateInfo
                  selectedDate={selectedDate}
                  selectedDateRecords={selectedDateRecords}
                />
              )}

              <TabelHistory tabelRecords={tabelRecords} />

              <TabelStatistics tabelRecords={tabelRecords} />
            </>
          )}
        </View>
      </AppScrollView>

      {/* QR Scanner Modal */}
      <QRScannerModal
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onSuccess={handleQRSuccess}
      />
    </ScreenContainer>
  );
};

