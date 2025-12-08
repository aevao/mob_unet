import { apiClient } from '../../../shared/api/client';
import type { ISchedule } from '../model/types';

export const fetchSchedules = async (): Promise<ISchedule> => {
  const { data } = await apiClient.get<ISchedule>('/api/students/schedule/my/');
  return data;
};

