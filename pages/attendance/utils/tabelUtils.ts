import type { TabelRecord } from '../../../entities/attendance/model/types';
import { convertDateToISO } from './dateUtils';

export const buildMarkedDates = (
  tabelRecords: TabelRecord[],
  selectedDate: string,
  isDark: boolean,
): Record<string, any> => {
  const markedDates: Record<string, any> = {};
  
  tabelRecords.forEach((record) => {
    const isoDate = convertDateToISO(record.date_day);
    const isCompleted = record.status_info === 'Завершен';
    
    if (markedDates[isoDate]) {
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
    
    if (isoDate === selectedDate) {
      markedDates[isoDate].selected = true;
      markedDates[isoDate].selectedColor = isDark ? '#3B82F6' : '#2563EB';
    }
  });
  
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: isDark ? '#3B82F6' : '#2563EB',
    };
  }
  
  return markedDates;
};

