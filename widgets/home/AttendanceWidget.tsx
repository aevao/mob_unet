import { useState, useEffect, useRef, useCallback } from 'react';
import { View, ActivityIndicator, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { ThemedCard } from '../../shared/ui/ThemedCard';
import { ThemedText } from '../../shared/ui/ThemedText';
import { useThemeStore } from '../../entities/theme/model/themeStore';
import { fetchMyTabelLast } from '../../entities/attendance/api/attendanceApi';
import { useTabelStore } from '../../entities/attendance/model/tabelStore';

// Форматирование даты и дня недели
const getFormattedDate = () => {
  const now = new Date();
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  const dayOfWeek = days[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  return {
    dayOfWeek,
    date: `${day} ${month} ${year}`,
  };
};

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
}

export const AttendanceWidget = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { lastUpdateTimestamp } = useTabelStore();

  const [lastTabelRecord, setLastTabelRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Анимация для иконки статуса (используем встроенный Animated API)
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const { dayOfWeek, date } = getFormattedDate();

  // Анимация пульсации для иконки
  useEffect(() => {
    // Анимация масштаба
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

    // Анимация прозрачности
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

  // Загрузка погоды (опционально)
  useEffect(() => {
    const loadWeather = async () => {
      try {
        setWeatherLoading(true);
        // Получаем геолокацию
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setWeatherLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Используем OpenWeatherMap API (нужен API ключ)
        // Для демо можно использовать бесплатный API или просто показать заглушку
        // Здесь я сделаю простую заглушку, так как нужен API ключ
        // Если у вас есть API ключ OpenWeatherMap, раскомментируйте код ниже:
        
    
        // const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
        // const response = await fetch(
        //   `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`
        // );
        // const data = await response.json();
        // setWeather({
        //   temperature: Math.round(data.main.temp),
        //   description: data.weather[0].description,
        //   icon: data.weather[0].icon,
        // });
 
        
        // Заглушка для демо (можно удалить, если есть реальный API)
        setWeather({
          temperature: 22,
          description: 'Ясно',
          icon: '01d',
        });
      } catch (error) {
        console.error('Error loading weather:', error);
      } finally {
        setWeatherLoading(false);
      }
    };

    void loadWeather();
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

  // Обновляем данные при изменении timestamp из store (когда происходит отметка)
  useEffect(() => {
    void loadLastTabel();
  }, [lastUpdateTimestamp, loadLastTabel]);

  // Обновляем данные при фокусе на экране (например, после возвращения с QR сканера)
  useFocusEffect(
    useCallback(() => {
      void loadLastTabel();
    }, [loadLastTabel])
  );

  const isTodayCompleted = lastTabelRecord?.status_info === 'Завершен';
  const isStarted = lastTabelRecord?.status_info === 'Начат';

  if (isLoading) {
    return (
      <View className="mb-4">
        <ThemedCard className="items-center p-4">
          <ActivityIndicator color={isDark ? '#60A5FA' : '#2563EB'} />
        </ThemedCard>
      </View>
    );
  }

  return (
    <View className="mb-4 ">
      <ThemedCard className="p-4">
        {/* Дата и день недели */}
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-1">
            <ThemedText variant="body" className="text-xs font-medium opacity-70">
              {dayOfWeek}
            </ThemedText>
            <ThemedText variant="title" className="text-sm font-medium">
              {date}
            </ThemedText>
          </View>
          
          {/* Погода */}
          {weather && (
            <View className="flex-row items-center">
              <Ionicons 
                name="partly-sunny-outline" 
                size={20} 
                color={isDark ? '#60A5FA' : '#2563EB'} 
              />
              <View className="ml-1.5">
                <ThemedText variant="body" className="text-xs font-semibold">
                  {weather.temperature}°
                </ThemedText>
                <ThemedText variant="muted" className="text-[10px]">
                  {weather.description}
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Статус */}
        <View className="w-full">
          <ThemedText variant="title" className="mb-2 text-center text-sm font-medium">
            Отметка посещаемости
          </ThemedText>
          {isTodayCompleted ? (
            <View className="items-center">
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                }}
                className={`mb-1.5 h-12 w-12 items-center justify-center rounded-full ${
                  isDark ? 'bg-green-900/30' : 'bg-green-50'
                }`}
              >
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </Animated.View>
              <ThemedText variant="body" className="text-center text-xs font-semibold text-green-600 dark:text-green-400">
                Завершено
              </ThemedText>
              {lastTabelRecord?.working_time && (
                <ThemedText variant="muted" className="mt-0.5 text-center text-[10px]">
                  Время работы: {lastTabelRecord.working_time}
                </ThemedText>
              )}
            </View>
          ) : isStarted ? (
            <View className="items-center">
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                }}
                className={`mb-1.5 h-12 w-12 items-center justify-center rounded-full ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}
              >
                <Ionicons name="time-outline" size={24} color={isDark ? '#60A5FA' : '#2563EB'} />
              </Animated.View>
              <ThemedText variant="body" className="text-center text-xs font-semibold text-blue-600 dark:text-blue-400">
                Начато
              </ThemedText>
              {lastTabelRecord?.time && (
                <ThemedText variant="muted" className="mt-0.5 text-center text-[10px]">
                  Начало: {lastTabelRecord.time}
                </ThemedText>
              )}
            </View>
          ) : (
            <View className="items-center">
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                }}
                className={`mb-1.5 h-12 w-12 items-center justify-center rounded-full ${
                  isDark ? 'bg-red-900/30' : 'bg-red-50'
                }`}
              >
                <Ionicons name="alert-circle-outline" size={24} color={isDark ? '#EF4444' : '#DC2626'} />
              </Animated.View>
              <ThemedText variant="body" className="text-center text-xs font-semibold text-red-600 dark:text-red-400">
                Еще не отметился
              </ThemedText>
            </View>
          )}
        </View>

      </ThemedCard>

    </View>
  );
};

