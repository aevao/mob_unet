import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenContainer } from '../../shared/ui/ScreenContainer';
import { AppScrollView } from '../../shared/ui/AppScrollView';
import { ThemedText } from '../../shared/ui/ThemedText';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { QRScannerModal, type ScanData } from '../../widgets/attendance/QRScannerModal';
import { fetchMyTabel, fetchMyTabelLast, postTabel, finishTabel } from '../../entities/attendance/api/attendanceApi';
import type { TabelRecord } from '../../entities/attendance/model/types';
import { OptimizedImage } from '../../shared/ui/OptimizedImage';
import { STORAGE_KEYS } from '../../shared/lib/storageKeys';
import { calculateDistance } from '../../shared/lib/distanceUtils';

// Преобразование даты из формата DD.MM.YYYY в YYYY-MM-DD
const convertDateToISO = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('.');
  return `${year}-${month}-${day}`;
};

export const TabScreen = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [tabelRecords, setTabelRecords] = useState<TabelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [activeTabelStart, setActiveTabelStart] = useState<{
    id: number;
    latitude: number;
    longitude: number;
    auditorium: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [lastTabelRecord, setLastTabelRecord] = useState<any>(null);

  // Не используем локальное хранилище, ориентируемся только на данные с сервера

  const loadTabel = useCallback(async () => {
    try {
      // Загружаем историю табеля
      const data = await fetchMyTabel();
      setTabelRecords(Array.isArray(data) ? data : []);

      // Загружаем последнюю запись табеля для определения сегодняшней отметки
      try {
        const lastRecord = await fetchMyTabelLast();
        setLastTabelRecord(lastRecord);
        
        // Проверяем, есть ли незавершенная отметка (статус "Начат")
        if (lastRecord.status_info === 'Начат' && lastRecord.geo) {
          try {
            // Парсим координаты из строки "lat, lon"
            const [lat, lon] = lastRecord.geo.split(',').map((s) => parseFloat(s.trim()));
            if (!isNaN(lat) && !isNaN(lon)) {
              // Используем ID из последней записи истории, если есть
              const historyRecord = data.find((r) => r.status_info === 'Начат');
              const startData = {
                id: historyRecord?.id || Date.now(), // Используем ID из истории или временный
                latitude: lat,
                longitude: lon,
                auditorium: lastRecord.auditorium || '',
              };
              setActiveTabelStart(startData);
            } else {
              setActiveTabelStart(null);
            }
          } catch (parseError) {
            console.error('Error parsing active record:', parseError);
            setActiveTabelStart(null);
          }
        } else {
          // Если статус не "Начат" или нет геолокации
          setActiveTabelStart(null);
        }
      } catch (lastError) {
        console.error('Error loading last tabel:', lastError);
        setLastTabelRecord(null);
        // Если не удалось загрузить последнюю запись, используем историю
        const activeRecord = data.find((record) => record.status_info === 'Начат');
        if (activeRecord && activeRecord.geo && activeRecord.id) {
          try {
            const [lat, lon] = activeRecord.geo.split(',').map((s) => parseFloat(s.trim()));
            if (!isNaN(lat) && !isNaN(lon)) {
              const startData = {
                id: activeRecord.id,
                latitude: lat,
                longitude: lon,
                auditorium: activeRecord.auditorium || '',
              };
              setActiveTabelStart(startData);
            } else {
              setActiveTabelStart(null);
            }
          } catch (parseError) {
            console.error('Error parsing active record:', parseError);
            setActiveTabelStart(null);
          }
        } else {
          setActiveTabelStart(null);
        }
      }
    } catch (error) {
      console.error('Error loading tabel:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить историю табеля. Попробуйте позже.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTabel();
  }, [loadTabel]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadTabel();
  }, [loadTabel]);

  const handleQRCodeScanned = useCallback(
    async (scanData: ScanData) => {
      setIsMarking(true);
      setShowQRScanner(false);

      try {
        // Формируем FormData как в веб-версии
        const formData = new FormData();
        const auditorium = `${scanData.campus}/${scanData.corpus}/${scanData.room}`;
        formData.append('auditorium', auditorium);
        const geoloc_info = `${scanData.latitude}, ${scanData.longitude}`;
        formData.append('geo', geoloc_info);
        
        // Фото не требуется при начале работы

        const response = await postTabel(formData);
        
        // Сохраняем данные начала работы
        const tabelId = response.id || response.tabel_id || response.data?.id || Date.now();
        const startData = {
          id: tabelId, // Используем ID из ответа или временный
          latitude: scanData.latitude,
          longitude: scanData.longitude,
          auditorium,
        };
        
        // Не сохраняем в локальное хранилище, используем только данные с сервера
        setActiveTabelStart(startData);
        
        Alert.alert('Успешно', 'Работа начата! Нажмите "Завершить" когда закончите.', [
          {
            text: 'OK',
            onPress: () => {
              loadTabel();
            },
          },
        ]);
      } catch (error: any) {
        console.error('Error marking attendance:', error);
        Alert.alert(
          'Ошибка',
          error.response?.data?.message || error.message || 'Не удалось отметиться. Проверьте QR-код и попробуйте снова.',
        );
      } finally {
        setIsMarking(false);
      }
    },
    [loadTabel],
  );

  const handleFinishTabel = useCallback(async () => {
    if (!activeTabelStart) {
      Alert.alert('Ошибка', 'Нет активной отметки для завершения');
      return;
    }

    setIsFinishing(true);

    try {
      // Получаем текущую геолокацию
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (!locationPermission.granted) {
        Alert.alert('Ошибка', 'Необходим доступ к геолокации для завершения работы');
        setIsFinishing(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const currentLat = currentLocation.coords.latitude;
      const currentLon = currentLocation.coords.longitude;

      // Проверяем расстояние (не более 20 метров)
      const distance = calculateDistance(
        activeTabelStart.latitude,
        activeTabelStart.longitude,
        currentLat,
        currentLon,
      );

      if (distance > 20) {
        Alert.alert(
          'Ошибка',
          `Вы находитесь слишком далеко от места начала работы (${Math.round(distance)}м). Для завершения необходимо находиться в пределах 20 метров от места начала.`,
        );
        setIsFinishing(false);
        return;
      }

      // Делаем второе фото (фронтальная камера для фото себя)
      const imagePermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!imagePermission.granted) {
        Alert.alert('Ошибка', 'Необходим доступ к камере для фото');
        setIsFinishing(false);
        return;
      }

      let photo;
      try {
        photo = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.7,
          base64: false,
          cameraType: ImagePicker.CameraType.front, // Фронтальная камера для фото себя
        });
      } catch (photoError: any) {
        console.error('Error launching camera:', photoError);
        Alert.alert('Ошибка', 'Не удалось открыть камеру. Попробуйте снова.');
        setIsFinishing(false);
        return;
      }

      if (photo.canceled) {
        Alert.alert('Отменено', 'Фото не было сделано');
        setIsFinishing(false);
        return;
      }

      if (!photo.assets || photo.assets.length === 0) {
        Alert.alert('Ошибка', 'Не удалось получить фото');
        setIsFinishing(false);
        return;
      }

      const photoAsset = photo.assets[0];
      
      if (!photoAsset.uri) {
        Alert.alert('Ошибка', 'Фото не содержит данных');
        setIsFinishing(false);
        return;
      }

      // Формируем FormData для завершения с тремя ключами
      const formData = new FormData();
      formData.append('auditorium', activeTabelStart.auditorium);
      
      // Получаем текущую геолокацию для geo
      const geoloc_info = `${currentLat}, ${currentLon}`;
      formData.append('geo', geoloc_info);
      
      // Проверяем формат URI для разных платформ
      let photoUri = photoAsset.uri;
      if (!photoUri.startsWith('file://') && !photoUri.startsWith('http://') && !photoUri.startsWith('https://')) {
        photoUri = `file://${photoUri}`;
      }
      
      // Формируем объект для FormData
      const imageFile = {
        uri: photoUri,
        type: 'image/jpeg',
        name: `tabel_end_${Date.now()}.jpg`,
      };
      
      formData.append('image', imageFile as any);

      console.log('Sending finish request with:', {
        auditorium: activeTabelStart.auditorium,
        geo: geoloc_info,
        image_uri: photoUri,
        image_file: imageFile,
      });

      await finishTabel(formData);

      // Загружаем обновленные данные с сервера (там будет обновленный статус)
      await loadTabel();

      Alert.alert('Успешно', 'Работа завершена!');
    } catch (error: any) {
      console.error('Error finishing tabel:', error);
      Alert.alert(
        'Ошибка',
        error.response?.data?.message || error.message || 'Не удалось завершить работу. Попробуйте снова.',
      );
    } finally {
      setIsFinishing(false);
    }
  }, [activeTabelStart, loadTabel]);

  // Формируем объект для календаря с отметками на основе данных с сервера
  const markedDates: Record<string, any> = {};
  tabelRecords.forEach((record) => {
    const isoDate = convertDateToISO(record.date_day);
    const isCompleted = record.status_info === 'Завершен';
    
    // Если дата уже есть в markedDates, обновляем её (на случай нескольких записей за день)
    if (markedDates[isoDate]) {
      // Если есть завершенная запись, приоритет у неё
      if (isCompleted || markedDates[isoDate].isCompleted) {
        markedDates[isoDate] = {
          ...markedDates[isoDate],
          marked: true,
          dotColor: isDark ? '#10B981' : '#059669',
          isCompleted: true,
        };
      }
    } else {
      markedDates[isoDate] = {
        marked: true,
        dotColor: isCompleted ? (isDark ? '#10B981' : '#059669') : (isDark ? '#F59E0B' : '#D97706'),
        isCompleted,
      };
    }
    
    // Обновляем selected для выбранной даты
    if (isoDate === selectedDate) {
      markedDates[isoDate].selected = true;
      markedDates[isoDate].selectedColor = isDark ? '#3B82F6' : '#2563EB';
    }
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

  // Находим все записи для выбранной даты
  const selectedDateRecords = tabelRecords.filter(
    (record) => convertDateToISO(record.date_day) === selectedDate,
  );

  // Проверяем, есть ли завершенная запись на сегодня на основе последней записи табеля
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

              {/* Кнопка отметиться или завершить */}
              {isTodayCompleted ? (
                <Pressable
                  disabled={true}
                  className={`mb-4 flex-row items-center justify-center rounded-xl border p-4 opacity-50 ${
                    isDark
                      ? 'bg-gray-800/20 border-gray-600/50'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={isDark ? '#10B981' : '#059669'}
                  />
                  <ThemedText
                    variant="body"
                    className={`ml-2 text-base font-semibold ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`}
                  >
                    Завершен
                  </ThemedText>
                </Pressable>
              ) : activeTabelStart ? (
                <Pressable
                  onPress={handleFinishTabel}
                  disabled={isFinishing}
                  className={`mb-4 flex-row items-center justify-center rounded-xl border p-4 ${
                    isDark
                      ? 'bg-green-900/20 border-green-500/50'
                      : 'bg-green-50 border-green-300'
                  } ${isFinishing ? 'opacity-50' : ''}`}
                >
                  {isFinishing ? (
                    <ActivityIndicator color={isDark ? '#10B981' : '#059669'} />
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={24}
                        color={isDark ? '#10B981' : '#059669'}
                      />
                      <ThemedText
                        variant="body"
                        className={`ml-2 text-base font-semibold ${
                          isDark ? 'text-green-400' : 'text-green-600'
                        }`}
                      >
                        Завершить
                      </ThemedText>
                    </>
                  )}
                </Pressable>
              ) : (
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
              )}

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

                  {selectedDateRecords.length > 0 ? (
                    <View className="mt-2">
                      {selectedDateRecords.map((record) => (
                        <View key={record.id} className="mb-3 rounded-lg border p-3" style={{
                          borderColor: isDark ? '#374151' : '#E5E7EB',
                          backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
                        }}>
                          <View className="mb-2 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                              <Ionicons
                                name={record.status_info === 'Завершен' ? 'checkmark-circle' : 'time'}
                                size={20}
                                color={record.status_info === 'Завершен' ? (isDark ? '#10B981' : '#059669') : (isDark ? '#F59E0B' : '#D97706')}
                              />
                              <ThemedText
                                variant="body"
                                className={`ml-2 text-sm font-medium ${
                                  record.status_info === 'Завершен'
                                    ? 'text-green-500'
                                    : 'text-amber-500'
                                }`}
                              >
                                {record.status_info}
                              </ThemedText>
                            </View>
                            <ThemedText variant="muted" className="text-xs">
                              {record.time}
                            </ThemedText>
                          </View>

                          {/* <View className="mb-2">
                            <ThemedText variant="muted" className="mb-1 text-xs">
                              Аудитория: {record.auditorium}
                            </ThemedText>
                            {record.auditorium_end && (
                              <ThemedText variant="muted" className="text-xs">
                                Аудитория окончания: {record.auditorium_end}
                              </ThemedText>
                            )}
                          </View> */}

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

              {/* История отметок */}
              {tabelRecords.length > 0 && (
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
                              color={record.status_info === 'Завершен' ? (isDark ? '#10B981' : '#059669') : (isDark ? '#F59E0B' : '#D97706')}
                            />
                            <ThemedText
                              variant="body"
                              className={`ml-1 text-xs ${
                                record.status_info === 'Завершен'
                                  ? 'text-green-500'
                                  : 'text-amber-500'
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
              )}

              {/* Статистика */}
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
                    {tabelRecords.filter((r) => r.status_info === 'Завершен').length}
                  </ThemedText>
                </View>
                <View className="mt-2 flex-row items-center justify-between">
                  <ThemedText variant="body" className="text-base">
                    В процессе:
                  </ThemedText>
                  <ThemedText variant="body" className="text-base font-bold text-amber-500">
                    {tabelRecords.filter((r) => r.status_info === 'Начат').length}
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

