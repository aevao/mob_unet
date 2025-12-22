import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { QRScannerModal } from '../../widgets/attendance/QRScannerModal';

interface Attendance {
  id: number;
  date: string; // YYYY-MM-DD
  qr_code: string;
  created_at: string;
}

export const TabScreen = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );

  const loadCalendar = useCallback(async () => {
    try {
      // TODO: Заменить на реальный API endpoint
      // const data = await fetchAttendanceCalendar();
      // setAttendances(Array.isArray(data.attendances) ? data.attendances : []);
      setAttendances([]);
    } catch (error) {
      console.error('Error loading calendar:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить календарь. Попробуйте позже.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadCalendar();
  }, [loadCalendar]);

  const handleQRCodeScanned = useCallback(
    async (qrCode: string) => {
      setIsMarking(true);
      setShowQRScanner(false);

      try {
        // TODO: Заменить на реальный API endpoint
        // const response = await markAttendance({ qr_code: qrCode });
        
        // Временная заглушка
        Alert.alert('Успешно', 'Вы успешно отметились!', [
          {
            text: 'OK',
            onPress: () => {
              loadCalendar();
            },
          },
        ]);
      } catch (error: any) {
        console.error('Error marking attendance:', error);
        Alert.alert(
          'Ошибка',
          error.response?.data?.message || 'Не удалось отметиться. Проверьте QR-код и попробуйте снова.',
        );
      } finally {
        setIsMarking(false);
      }
    },
    [loadCalendar],
  );

  // Формируем объект для календаря с отметками
  const markedDates: Record<string, any> = {};
  attendances.forEach((attendance) => {
    markedDates[attendance.date] = {
      marked: true,
      dotColor: isDark ? '#60A5FA' : '#2563EB',
      selected: attendance.date === selectedDate,
      selectedColor: isDark ? '#3B82F6' : '#2563EB',
    };
  });

  // Выделяем выбранную дату
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: isDark ? '#3B82F6' : '#2563EB',
    };
  }

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const selectedAttendance = attendances.find((a) => a.date === selectedDate);

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
              {/* Календарь */}
              <ThemedCard className="mb-4 overflow-hidden">
                <Calendar
                  current={selectedDate}
                  onDayPress={onDayPress}
                  markedDates={markedDates}
                  theme={{
                    backgroundColor: isDark ? '#111827' : '#FFFFFF',
                    calendarBackground: isDark ? '#111827' : '#FFFFFF',
                    textSectionTitleColor: isDark ? '#9CA3AF' : '#6B7280',
                    selectedDayBackgroundColor: isDark ? '#3B82F6' : '#2563EB',
                    selectedDayTextColor: '#FFFFFF',
                    todayTextColor: isDark ? '#60A5FA' : '#2563EB',
                    dayTextColor: isDark ? '#F9FAFB' : '#111827',
                    textDisabledColor: isDark ? '#4B5563' : '#D1D5DB',
                    dotColor: isDark ? '#60A5FA' : '#2563EB',
                    selectedDotColor: '#FFFFFF',
                    arrowColor: isDark ? '#60A5FA' : '#2563EB',
                    monthTextColor: isDark ? '#F9FAFB' : '#111827',
                    textDayFontWeight: '500',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '600',
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 13,
                  }}
                  style={{
                    borderRadius: 12,
                  }}
                />
              </ThemedCard>

              {/* Кнопка отметиться */}
              <Pressable
                onPress={() => setShowQRScanner(true)}
                disabled={isMarking}
                className={`mb-4 flex-row items-center justify-center rounded-xl border p-4 ${
                  isDark
                    ? 'bg-blue-900/20 border-blue-500/50'
                    : 'bg-blue-50 border-blue-300'
                } ${isMarking ? 'opacity-50' : ''}`}
              >
                {isMarking ? (
                  <ActivityIndicator color={isDark ? '#60A5FA' : '#2563EB'} />
                ) : (
                  <>
                    <Ionicons
                      name="qr-code-outline"
                      size={24}
                      color={isDark ? '#60A5FA' : '#2563EB'}
                    />
                    <ThemedText
                      variant="body"
                      className={`ml-2 text-base font-semibold ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}
                    >
                      Отметиться
                    </ThemedText>
                  </>
                )}
              </Pressable>

              {/* Информация о выбранной дате */}
              {selectedDate && (
                <ThemedCard className="mb-4 p-4">
                  <ThemedText variant="title" className="mb-2 text-lg font-semibold">
                    {new Date(selectedDate).toLocaleDateString('ru-RU', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </ThemedText>

                  {selectedAttendance ? (
                    <View className="mt-2">
                      <View className="mb-2 flex-row items-center">
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={isDark ? '#10B981' : '#059669'}
                        />
                        <ThemedText variant="body" className="ml-2 text-sm font-medium text-green-500">
                          Отмечено
                        </ThemedText>
                      </View>
                      <ThemedText variant="muted" className="mt-1 text-xs">
                        Время отметки: {new Date(selectedAttendance.created_at).toLocaleTimeString('ru-RU')}
                      </ThemedText>
                    </View>
                  ) : (
                    <View className="mt-2">
                      <View className="flex-row items-center">
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color={isDark ? '#EF4444' : '#DC2626'}
                        />
                        <ThemedText variant="body" className="ml-2 text-sm font-medium text-red-500">
                          Не отмечено
                        </ThemedText>
                      </View>
                    </View>
                  )}
                </ThemedCard>
              )}

              {/* Статистика */}
              <ThemedCard className="p-4">
                <ThemedText variant="title" className="mb-3 text-lg font-semibold">
                  Статистика
                </ThemedText>
                <View className="flex-row items-center justify-between">
                  <ThemedText variant="body" className="text-base">
                    Всего отметок:
                  </ThemedText>
                  <ThemedText variant="body" className="text-base font-bold">
                    {attendances.length}
                  </ThemedText>
                </View>
              </ThemedCard>
            </>
          )}
        </View>
      </AppScrollView>

      {/* QR Scanner Modal */}
      <QRScannerModal
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRCodeScanned}
      />
    </ScreenContainer>
  );
};

