import { create } from 'zustand';
import { fetchNews } from '../api/newsApi';
import type { News } from './types';

interface NewsState {
  news: News[];
  isLoading: boolean;
  error: string | null;
  fetchNews: () => Promise<void>;
}

export const useNewsStore = create<NewsState>((set) => ({
  news: [],
  isLoading: false,
  error: null,

  fetchNews: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchNews();
      set({ news: data, isLoading: false, error: null });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Не удалось загрузить новости';
      set({ error: message, isLoading: false, news: [] });
    }
  },
}));

