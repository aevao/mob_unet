import { apiClient } from '../../../shared/api/client';
import type { News } from '../model/types';

export const fetchNews = async (): Promise<News[]> => {
  const { data } = await apiClient.get<News[]>('/api/news/');
  return data;
};

