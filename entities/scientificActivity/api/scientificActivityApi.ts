import { apiClient } from '../../../shared/api/client';
import type { ScientificActivityCategory } from '../model/types';

export const fetchAllScientificActivityCategories = async (): Promise<ScientificActivityCategory[]> => {
  const { data } = await apiClient.get<ScientificActivityCategory[]>('/api/all-category/');
  return data;
};
