import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { fetchMyTabel, fetchMyTabelLast } from '../../../entities/attendance/api/attendanceApi';
import type { TabelRecord } from '../../../entities/attendance/model/types';

interface ActiveTabelStart {
  id: number;
  latitude: number;
  longitude: number;
  auditorium: string;
}

export const useTabelData = () => {
  const [tabelRecords, setTabelRecords] = useState<TabelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTabelStart, setActiveTabelStart] = useState<ActiveTabelStart | null>(null);
  const [lastTabelRecord, setLastTabelRecord] = useState<any>(null);

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
              const startData: ActiveTabelStart = {
                id: historyRecord?.id || Date.now(),
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
              const startData: ActiveTabelStart = {
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

  return {
    tabelRecords,
    isLoading,
    isRefreshing,
    activeTabelStart,
    lastTabelRecord,
    loadTabel,
    onRefresh,
  };
};

