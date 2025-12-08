import { apiClient } from '../../../shared/api/client';
import type { Subject } from '../model/types';

export const fetchSubjects = async (): Promise<Subject[]> => {
  const { data } = await apiClient.get<Subject[]>('/api/students/subjects/');
  return data;
};

