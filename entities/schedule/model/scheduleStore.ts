import { create } from 'zustand';
import { fetchSchedules } from '../api/scheduleApi';
import type { ISchedule, DayOfWeek } from './types';

interface ScheduleState {
  schedule: ISchedule | null;
  isLoading: boolean;
  error: string | null;
  fetchSchedule: () => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedule: null,
  isLoading: false,
  error: null,

  fetchSchedule: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchSchedules();
      set({ schedule: data, isLoading: false, error: null });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Не удалось загрузить расписание';
      set({ error: message, isLoading: false, schedule: null });
    }
  },
}));

