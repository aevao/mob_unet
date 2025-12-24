import { useState, useEffect, useRef, useCallback } from 'react';
import { Pressable, View, ActivityIndicator, Animated } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { fetchMyTabelLast } from '../../entities/attendance/api/attendanceApi';
import { useTabelStore } from '../../entities/attendance/model/tabelStore';
import type { HomeStackParamList } from '../../app/navigation/types';

type AttendanceTileNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const AttendanceTile = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { lastUpdateTimestamp } = useTabelStore();
  const navigation = useNavigation<AttendanceTileNavigationProp>();

  const [lastTabelRecord, setLastTabelRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Анимация для иконки статуса
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Анимация пульсации для иконки
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          useNativeDriver: true,
          tension: 50,
          friction: 3,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 3,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const loadLastTabel = useCallback(async () => {
    try {
      setIsLoading(true);
      const lastRecord = await fetchMyTabelLast();
      setLastTabelRecord(lastRecord);
    } catch (error) {
      console.error('Error loading last tabel:', error);
      setLastTabelRecord(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Загружаем данные при монтировании
  useEffect(() => {
    void loadLastTabel();
  }, [loadLastTabel]);

  // Обновляем данные при изменении timestamp из store
  useEffect(() => {
    void loadLastTabel();
  }, [lastUpdateTimestamp, loadLastTabel]);

  // Обновляем данные при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      void loadLastTabel();
    }, [loadLastTabel])
  );

  const isTodayCompleted = lastTabelRecord?.status_info === 'Завершен';
  const isStarted = lastTabelRecord?.status_info === 'Начат';

  // Определяем иконку и цвет в зависимости от статуса
  let statusIcon: keyof typeof Ionicons.glyphMap = 'calendar-outline';
  let statusColor = isDark ? '#60A5FA' : '#3B82F6';
  let statusText = 'Отметка посещаемости';
  let statusBg = isDark ? 'bg-blue-900/30' : 'bg-blue-50';

  if (isTodayCompleted) {
    statusIcon = 'checkmark-circle';
    statusColor = '#10B981';
    statusText = 'Завершено';
    statusBg = isDark ? 'bg-green-900/30' : 'bg-green-50';
  } else if (isStarted) {
    statusIcon = 'time-outline';
    statusColor = isDark ? '#60A5FA' : '#2563EB';
    statusText = 'Начато';
    statusBg = isDark ? 'bg-blue-900/30' : 'bg-blue-50';
  }

  const iconColor = isDark ? '#60A5FA' : '#3B82F6';

  if (isLoading) {
    return (
      <View className="w-[48%]">
        <ThemedCard className="min-h-[120px] items-center justify-center p-4">
          <ActivityIndicator color={isDark ? '#60A5FA' : '#2563EB'} />
        </ThemedCard>
      </View>
    );
  }

  return (
    <View className="w-[48%]">
      <Pressable
        onPress={() => {
          navigation.navigate('Tab');
        }}
        className="active:opacity-80"
      >
        <ThemedCard className="min-h-[120px] justify-between p-4">
          <View className="items-start">
            <View className={`mb-3 h-12 w-12 items-center justify-center rounded-xl ${statusBg}`}>
              {isTodayCompleted || isStarted ? (
                <Animated.View
                  style={{
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                  }}
                >
                  <Ionicons name={statusIcon} size={24} color={statusColor} />
                </Animated.View>
              ) : (
                <Ionicons name={statusIcon} size={24} color={iconColor} />
              )}
            </View>
            <ThemedText
              variant="body"
              className={`text-base font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
            >
              Табель
            </ThemedText>
            <ThemedText variant="muted" className="mt-1 text-xs leading-4">
              {statusText}
            </ThemedText>
            {isTodayCompleted && lastTabelRecord?.working_time && (
              <ThemedText variant="muted" className="mt-1 text-[10px]">
                Время: {lastTabelRecord.working_time}
              </ThemedText>
            )}
            {isStarted && lastTabelRecord?.time && (
              <ThemedText variant="muted" className="mt-1 text-[10px]">
                Начало: {lastTabelRecord.time}
              </ThemedText>
            )}
          </View>
        </ThemedCard>
      </Pressable>
    </View>
  );
};

